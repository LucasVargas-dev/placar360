import { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyTable,
  Skeleton,
} from '@packages/components'

type DataTableColumn<TData> = {
  id: string
  header: ReactNode
  cell: (row: TData, index: number) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

type DataTableProps<TData> = {
  columns: readonly DataTableColumn<TData>[]
  data: TData[]
  isLoading?: boolean
  itemsPerPage?: number
  emptyMessage?: string
  getRowKey?: (row: TData, index: number) => string | number
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  itemsPerPage,
  emptyMessage,
  getRowKey,
}: DataTableProps<TData>) {
  const loadingRows = Math.max(itemsPerPage ?? data.length ?? 3, 1)

  return (
    <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white">
      <Table className="min-w-full" isCompact>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={column.id}
                className={column.headerClassName}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map(column => (
                    <TableCell
                      key={`${column.id}-loading-${rowIndex}`}
                      className={column.cellClassName}
                    >
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.length === 0
              ? (
                <EmptyTable
                  message={emptyMessage}
                  colSpan={columns.length}
                />
                )
              : data.map((row, index) => (
                  <TableRow
                    key={getRowKey ? getRowKey(row, index) : index}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    {columns.map(column => (
                      <TableCell
                        key={`${column.id}-${index}`}
                        className={column.cellClassName}
                      >
                        {column.cell(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
        </TableBody>
      </Table>
    </div>
  )
}


