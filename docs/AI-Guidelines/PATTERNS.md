# Reusable Patterns

## Component Patterns

### 1. Component Structure Pattern
```tsx
// Standard component structure
import { ReactNode } from 'react'

interface ComponentProps {
  children?: ReactNode
  className?: string
  // Specific props with JSDoc
}

export function Component({ children, className = '', ...props }: ComponentProps) {
  return (
    <div className={`base-classes ${className}`} {...props}>
      {children}
    </div>
  )
}

// Named export for type
export type { ComponentProps }
```

### 2. Composition Pattern
```tsx
// Compound component pattern for flexibility
export function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b border-gray-200">{children}</div>
}

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>
}

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="p-4 border-t border-gray-200">{children}</div>
}

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### 3. Conditional Rendering Pattern
```tsx
// Clean conditional rendering
export function EventCard({ event }: EventCardProps) {
  const isUpcoming = new Date(event.date) > new Date()
  const hasRegistration = event.registrationRequired

  return (
    <Card>
      <Card.Header>
        {event.title}
        {isUpcoming && <Badge variant="success">Upcoming</Badge>}
      </Card.Header>
      <Card.Body>
        <p>{event.description}</p>
        {hasRegistration && (
          <Button onClick={() => registerForEvent(event.id)}>
            Register Now
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
```

## State Management Patterns

### 1. Local State Pattern
```tsx
// Simple local state for component-specific data
export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await submitContactForm(formData)
      // Handle success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form JSX */}
    </form>
  )
}
```

### 2. Custom Hook Pattern
```tsx
// Reusable logic extraction
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}

// Usage in component
export function BlogList() {
  const { data: posts, loading, error } = useApi<BlogPost[]>('/api/posts')

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!posts) return <EmptyState />

  return (
    <div>
      {posts.map(post => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}
```

## API Integration Patterns

### 1. Service Layer Pattern
```tsx
// Centralized API service
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
```

### 2. Error Boundary Pattern
```tsx
// Global error handling
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Styling Patterns

### 1. Component Styling Pattern
```tsx
// Consistent styling approach with variants
const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-accent-600 hover:bg-accent-700 text-white',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

interface ButtonProps {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${buttonVariants[variant]}
    ${buttonSizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
```

## Performance Patterns

### 1. Lazy Loading Pattern
```tsx
// Component lazy loading
import { lazy, Suspense } from 'react'

const AudioPlayer = lazy(() => import('@/components/media/AudioPlayer'))
const VideoPlayer = lazy(() => import('@/components/media/VideoPlayer'))

export function MediaContent({ mediaType, src }: MediaContentProps) {
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded" />}>
      {mediaType === 'audio' ? (
        <AudioPlayer src={src} />
      ) : (
        <VideoPlayer src={src} />
      )}
    </Suspense>
  )
}
```

### 2. Memoization Pattern
```tsx
// Component memoization for performance
export const BlogCard = memo(function BlogCard({ post }: BlogCardProps) {
  return (
    <Card>
      <Card.Header>{post.title}</Card.Header>
      <Card.Body>{post.excerpt}</Card.Body>
    </Card>
  )
})

// Custom hook memoization
export function useFilteredPosts(posts: BlogPost[], filter: string) {
  return useMemo(() => {
    if (!filter) return posts
    return posts.filter(post =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.content.toLowerCase().includes(filter.toLowerCase())
    )
  }, [posts, filter])
}
```

## Form Patterns

### 1. Controlled Form Pattern
```tsx
// Consistent form handling
interface FormData {
  [key: string]: string | boolean | number
}

export function useForm<T extends FormData>(initialState: T) {
  const [data, setData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = (field: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (validationRules: Record<keyof T, (value: T[keyof T]) => string | undefined>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.entries(validationRules).forEach(([field, rule]) => {
      const error = rule(data[field as keyof T])
      if (error) newErrors[field as keyof T] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = () => {
    setData(initialState)
    setErrors({})
  }

  return { data, errors, handleChange, validate, reset }
}
```

## File Organization Pattern

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── content/        # Content-specific components
│   ├── forms/          # Form components
│   └── spiritual/      # Domain-specific components
├── lib/
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Usage Guidelines

1. **Always check this file before implementing new patterns**
2. **Update patterns when creating reusable solutions**
3. **Prefer composition over inheritance**
4. **Keep components under 200 lines**
5. **Use TypeScript strict mode**
6. **Follow mobile-first responsive design**
7. **Implement proper error handling**
8. **Add JSDoc comments for complex logic**