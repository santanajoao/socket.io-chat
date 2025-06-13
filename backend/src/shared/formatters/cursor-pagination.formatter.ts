export class CursorPaginationFormatter {
  static formatCursorPagination<T>({
    data,
    cursorColumn,
    pageSize,
  }: {
    data: T[];
    cursorColumn: keyof T;
    pageSize?: number;
  }) {
    const hasMore = data.length === pageSize;
    const requestedData = hasMore ? data.slice(0, -1) : data;

    const hasItem = pageSize ? data.at(-1) : undefined;
    const nextCursor = hasMore ? hasItem?.[cursorColumn] : undefined;

    return {
      data: requestedData,
      next: nextCursor,
    };
  }
}
