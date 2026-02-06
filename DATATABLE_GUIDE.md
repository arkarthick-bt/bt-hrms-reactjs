# Modern DataTable Component - Usage Guide

## 🎨 Features

✅ **Pagination** - Full pagination with page size selector  
✅ **Sorting** - Click column headers to sort (asc/desc)  
✅ **Search** - Global search across all columns  
✅ **Loading States** - Beautiful loading spinner  
✅ **Empty States** - Friendly empty state message  
✅ **Row Click** - Navigate on row click  
✅ **Responsive** - Mobile-friendly design  
✅ **Theme Support** - Works with light/dark themes  
✅ **Beautiful UI** - Modern, premium design

---

## 📋 Basic Usage

```tsx
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

function UserList() {
  const users: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

  return <DataTable columns={columns} data={users} />;
}
```

---

## 🔧 Props

| Prop                 | Type                          | Default       | Description               |
| -------------------- | ----------------------------- | ------------- | ------------------------- |
| `columns`            | `ColumnDef<TData>[]`          | Required      | Column definitions        |
| `data`               | `TData[]`                     | Required      | Data array                |
| `loading`            | `boolean`                     | `false`       | Show loading state        |
| `searchable`         | `boolean`                     | `false`       | Enable search bar         |
| `searchPlaceholder`  | `string`                      | `"Search..."` | Search input placeholder  |
| `onSearch`           | `(value: string) => void`     | -             | Search callback           |
| `manualPagination`   | `boolean`                     | `false`       | Server-side pagination    |
| `pageCount`          | `number`                      | -             | Total pages (server-side) |
| `rowCount`           | `number`                      | -             | Total rows (server-side)  |
| `pagination`         | `PaginationState`             | -             | Controlled pagination     |
| `onPaginationChange` | `OnChangeFn<PaginationState>` | -             | Pagination callback       |
| `onRowClick`         | `(row: TData) => void`        | -             | Row click handler         |
| `striped`            | `boolean`                     | `true`        | Striped rows              |
| `hover`              | `boolean`                     | `true`        | Hover effect              |
| `className`          | `string`                      | `''`          | Additional CSS class      |

---

## 💡 Examples

### 1. With Search

```tsx
<DataTable
  columns={columns}
  data={data}
  searchable
  searchPlaceholder="Search roles..."
/>
```

### 2. With Server-Side Pagination

```tsx
const [currentPage, setCurrentPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const [totalCount, setTotalCount] = useState(0)

<DataTable
  columns={columns}
  data={roles}
  loading={loading}
  manualPagination
  rowCount={totalCount}
  pagination={{
    pageIndex: currentPage - 1,
    pageSize: pageSize
  }}
  onPaginationChange={(updater) => {
    if (typeof updater === 'function') {
      const nextState = updater({
        pageIndex: currentPage - 1,
        pageSize: pageSize
      })
      setCurrentPage(nextState.pageIndex + 1)
      setPageSize(nextState.pageSize)
    }
  }}
/>
```

### 3. With Row Click

```tsx
<DataTable
  columns={columns}
  data={employees}
  onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
/>
```

### 4. With Custom Cell Rendering

```tsx
const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => (
      <div className="fw-bold text-primary">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <CBadge
        color={row.original.isActive ? "success" : "secondary"}
        shape="rounded-pill"
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </CBadge>
    ),
  },
];
```

### 5. With Sortable Columns

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true, // Enable sorting for this column
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false, // Disable sorting for actions column
    cell: ({ row }) => <CButton size="sm">Edit</CButton>,
  },
];
```

### 6. With Search and Server-Side Filtering

```tsx
const [searchQuery, setSearchQuery] = useState('')

useEffect(() => {
  fetchData(searchQuery)
}, [searchQuery])

<DataTable
  columns={columns}
  data={data}
  searchable
  onSearch={(value) => setSearchQuery(value)}
  loading={loading}
/>
```

---

## 🎨 Styling

The DataTable automatically adapts to your theme:

- **Light Mode**: Clean, bright design
- **Dark Mode**: Elegant dark theme
- **Custom Themes**: Uses CSS variables from your theme

### Custom Styling

```tsx
<DataTable
  columns={columns}
  data={data}
  className="my-custom-table"
  striped={false}
  hover={true}
/>
```

---

## 🚀 Advanced Features

### Column Definitions

```tsx
const columns: ColumnDef<Employee>[] = [
  // Simple column
  {
    accessorKey: "name",
    header: "Name",
  },

  // Custom cell rendering
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
    ),
  },

  // Computed column
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },

  // Actions column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="d-flex gap-2">
        <CButton size="sm" color="primary">
          Edit
        </CButton>
        <CButton size="sm" color="danger">
          Delete
        </CButton>
      </div>
    ),
  },
];
```

---

## 📱 Responsive Design

The table is fully responsive:

- Horizontal scroll on small screens
- Stacked pagination controls on mobile
- Touch-friendly buttons

---

## 🎯 Best Practices

1. **Always define column types** for type safety
2. **Use `accessorKey`** for simple data access
3. **Use `id`** for computed or action columns
4. **Enable sorting** only for sortable data
5. **Use `manualPagination`** for large datasets
6. **Provide `rowCount`** for accurate pagination
7. **Add loading states** for better UX

---

## 🔥 Complete Example (RolesList)

```tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { CBadge } from "@coreui/react";

interface Role {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

function RolesList() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => <div className="fw-bold">{row.original.name}</div>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-monospace text-muted">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <CBadge
          color={row.original.isActive ? "success" : "secondary"}
          shape="rounded-pill"
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </CBadge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={roles}
      loading={loading}
      searchable
      searchPlaceholder="Search roles..."
      onSearch={setSearchQuery}
      manualPagination
      rowCount={totalCount}
      pagination={{
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      }}
      onPaginationChange={(updater) => {
        if (typeof updater === "function") {
          const nextState = updater({
            pageIndex: currentPage - 1,
            pageSize: pageSize,
          });
          setCurrentPage(nextState.pageIndex + 1);
          setPageSize(nextState.pageSize);
        }
      }}
      onRowClick={(role) => navigate(`/roles/${role.id}/permissions`)}
    />
  );
}
```

---

## ✨ Features Showcase

- **Smooth Animations**: Fade-in on load, hover effects
- **Visual Feedback**: Active sort indicators, hover states
- **Accessibility**: Keyboard navigation, ARIA labels
- **Performance**: Optimized rendering with TanStack Table
- **Customizable**: Every aspect can be customized

---

**Enjoy your new modern DataTable! 🎉**
