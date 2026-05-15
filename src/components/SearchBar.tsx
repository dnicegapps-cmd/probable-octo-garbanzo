import { useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const composingRef = useRef(false)

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (!composingRef.current) onChange(e.target.value)
        }}
        onCompositionStart={() => { composingRef.current = true }}
        onCompositionEnd={(e) => {
          composingRef.current = false
          onChange((e.target as HTMLInputElement).value)
        }}
        placeholder={placeholder ?? 'Search by character, pinyin, or meaning…'}
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Clear"
        >
          ×
        </button>
      )}
    </div>
  )
}
