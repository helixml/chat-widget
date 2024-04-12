import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser'
import { useCallback, useState } from 'react'

const useStreamingLLM = ({
  url,
  model,
  bearerToken,
  onStart,
  onChunk,
  onError,
}: {
  url: string,
  model: string,
  bearerToken?: string,
  onStart: () => void,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
}) => {
  const [ loading, setLoading ] = useState(false)
  const handleQuery = useCallback(async (query: string) => {
    setLoading(true)
    onStart()
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if(bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            {role: 'user', content: query},
          ],
          stream: true,
        }),
      })

      if(!response.ok) {
        throw new Error(`response not ok: ${response.status}`)
      }

      const reader = response.body?.getReader()

      if(!reader) {
        throw new Error(`no reader found`)
      }

      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          // If there's no data, skip
          if (!event.data || event.data === '') {
            return
          }
          // If the response is [DONE], skip -- the OpenAI API sends this to indicate the end of the stream
          if (event.data === "[DONE]") {
            return
          }
          const parsedData = JSON.parse(event.data) as any
          const text = parsedData?.choices[0]?.delta?.content
          // If there's no text, skip
          if (!text) {
            return
          }
          onChunk(text)
        }
      })
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        parser.feed(new TextDecoder().decode(value))
      }
    } catch (err: any) {
      onError(err.message)
    }
    setLoading(false)
  }, [
    url,
    model,
    bearerToken,
    onStart,
    onChunk,
    onError,
  ])

  return {
    loading,
    handleQuery,
  }
}

export default useStreamingLLM
