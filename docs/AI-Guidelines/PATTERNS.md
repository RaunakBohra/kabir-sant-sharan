# Reusable Patterns - Kabir Sant Sharan

**Last Updated:** 2025-09-30

---

## Responsive Typography

```tsx
// Headings
text-2xl sm:text-3xl md:text-4xl lg:text-5xl

// Body
text-sm sm:text-base lg:text-lg

// Labels  
text-xs sm:text-sm
```

---

## Responsive Layout

```tsx
// Stacking
flex flex-col sm:flex-row gap-3 sm:gap-6

// Grid
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Spacing
px-3 sm:px-4 lg:px-6
py-2 sm:py-3 lg:py-4
gap-2 sm:gap-3 lg:gap-4
mb-4 sm:mb-6 lg:mb-8

// Touch targets
min-h-[44px] touch-manipulation
```

---

## Theme Colors

```tsx
// Backgrounds
bg-cream-50 bg-cream-100 bg-cream-200 bg-cream-300 bg-cream-500

// Text
text-dark-500 text-dark-600 text-dark-700 text-dark-800 text-dark-900

// Borders
border-cream-200 border-cream-300 border-dark-200 border-dark-300

// Icons (never colored)
text-dark-600

// Focus (always)
focus:ring-2 focus:ring-dark-900 focus:border-dark-900

// Spinners (always)
border-b-2 border-dark-900
```

---

## API Response

```typescript
// Success
{ success: true, data: T }

// Error
{ error: string, code?: string, details?: any }

// List
{ items: T[], total: number, page?: number }
```

---

## Database Fields

```typescript
// camelCase (NOT snake_case)
startDate, endDate, type, featured
registrationRequired, currentAttendees
createdAt, updatedAt, coverImage
fileUrl, fileSize, mimeType
```

---

## Auth Check

```typescript
const { user } = await getSession()
if (!user || !user.isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## Loading State

```tsx
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
  <span className="ml-3 text-dark-600">Loading...</span>
</div>
```

---

## Mobile Navigation

```tsx
// Bottom Nav (user side)
<BottomNav items={navItems} />  // lg:hidden

// Off-canvas Sidebar (admin)
<AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
```

---

## Form Input

```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-cream-300 rounded-lg 
  focus:ring-2 focus:ring-dark-900 focus:border-dark-900"
/>
```

---

## Button

```tsx
// Primary
<button className="px-6 py-3 bg-dark-900 text-cream-50 rounded-lg 
  hover:bg-dark-800 transition-colors min-h-[44px]">

// Secondary
<button className="px-6 py-3 border-2 border-cream-300 text-dark-700 
  rounded-lg hover:bg-cream-200 transition-colors min-h-[44px]">
```

---

## Card

```tsx
<div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200 
  p-4 sm:p-6 hover:shadow-xl transition-shadow">
```

---

## Admin Page Layout

```tsx
<ProtectedRoute requireAdmin={true}>
  <div className="min-h-screen bg-cream-100">
    <div className="flex">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {/* Content */}
      </div>
    </div>
  </div>
</ProtectedRoute>
```

---

## Notes

- Copy patterns as-is, don't modify
- Update when discovering new reusable patterns
- Check COMPONENT_INVENTORY before creating new components
