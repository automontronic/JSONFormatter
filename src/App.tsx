import React, { useState, useCallback } from 'react'
import { Check, Copy, Download, EyeOff, Eye, Moon, Sun } from 'lucide-react'

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [formattedJson, setFormattedJson] = useState('')
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const validateJSON = useCallback(() => {
    try {
      JSON.parse(jsonInput)
      setError('')
      setIsValid(true)
      return true
    } catch (e: any) {
      setError(e.message)
      setIsValid(false)
      return false
    }
  }, [jsonInput])

  const beautifyJSON = useCallback(() => {
    if (validateJSON()) {
      try {
        const parsed = JSON.parse(jsonInput)
        setFormattedJson(JSON.stringify(parsed, null, 2))
      } catch (e: any) {
        setError(e.message)
      }
    }
  }, [jsonInput, validateJSON])

  const minifyJSON = useCallback(() => {
    if (validateJSON()) {
      try {
        const parsed = JSON.parse(jsonInput)
        setFormattedJson(JSON.stringify(parsed))
      } catch (e: any) {
        setError(e.message)
      }
    }
  }, [jsonInput, validateJSON])

  const copyToClipboard = useCallback(() => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson)
        .then(() => {
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
        })
        .catch(err => {
          setError('Failed to copy: ' + err)
        })
    }
  }, [formattedJson])

  const downloadJSON = useCallback(() => {
    if (formattedJson) {
      try {
        const blob = new Blob([formattedJson], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'formatted.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err: any) {
        setError('Download failed: ' + err.message)
      }
    }
  }, [formattedJson])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-gray-100'
  const textColor = darkMode ? 'text-white' : 'text-gray-800'
  const buttonBg = darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
  const buttonText = 'text-white'
  const textareaBg = darkMode ? 'bg-gray-700 text-white' : 'bg-white'
  const errorColor = darkMode ? 'text-red-400' : 'text-red-600'
  const successColor = darkMode ? 'text-green-400' : 'text-green-600'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300 p-4`}>
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">JSON Formatter & Validator</h1>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
            {darkMode ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </button>
        </header>

        <section className="mb-6">
          <label htmlFor="jsonInput" className="block mb-2 text-lg font-medium">Enter JSON:</label>
          <textarea
            id="jsonInput"
            className={`w-full h-64 p-3 rounded-md ${textareaBg} ${textColor} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            placeholder="Paste your JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </section>

        <section className="flex flex-wrap gap-4 mb-6">
          <button
            className={`px-5 py-2 rounded-md ${buttonBg} ${buttonText} hover:scale-105 transition-transform duration-200`}
            onClick={validateJSON}
          >
            <Check className="inline-block mr-2 w-5 h-5" />
            Validate JSON
          </button>
          <button
            className={`px-5 py-2 rounded-md ${buttonBg} ${buttonText} hover:scale-105 transition-transform duration-200`}
            onClick={beautifyJSON}
          >
            Beautify JSON
          </button>
          <button
            className={`px-5 py-2 rounded-md ${buttonBg} ${buttonText} hover:scale-105 transition-transform duration-200`}
            onClick={minifyJSON}
          >
            Minify JSON
          </button>
          <button
            className={`px-5 py-2 rounded-md ${buttonBg} ${buttonText} hover:scale-105 transition-transform duration-200 relative`}
            onClick={copyToClipboard}
            disabled={!formattedJson}
          >
            <Copy className="inline-block mr-2 w-5 h-5" />
            Copy to Clipboard
            {isCopied && (
              <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-green-500 text-white rounded-md opacity-90">
                Copied!
              </span>
            )}
          </button>
          <button
            className={`px-5 py-2 rounded-md ${buttonBg} ${buttonText} hover:scale-105 transition-transform duration-200`}
            onClick={downloadJSON}
            disabled={!formattedJson}
          >
            <Download className="inline-block mr-2 w-5 h-5" />
            Download JSON
          </button>
        </section>

        {error && (
          <div className={`mb-6 p-4 rounded-md ${errorColor} bg-red-100 dark:bg-red-700 dark:text-red-100`}>
            <h3 className="font-semibold">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {isValid && !error && (
          <div className={`mb-6 p-4 rounded-md ${successColor} bg-green-100 dark:bg-green-700 dark:text-green-100`}>
            <h3 className="font-semibold">Success:</h3>
            <p>Valid JSON!</p>
          </div>
        )}

        {formattedJson && (
          <section>
            <label htmlFor="formattedJson" className="block mb-2 text-lg font-medium">Formatted JSON:</label>
            <textarea
              id="formattedJson"
              className={`w-full h-64 p-3 rounded-md ${textareaBg} ${textColor} border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
              placeholder="Formatted JSON will appear here..."
              value={formattedJson}
              readOnly
            />
          </section>
        )}
      </div>
    </div>
  )
}

export default App
