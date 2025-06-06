export class CursorPaginationFormatter {
  static formatCursorPagination<T>(
    data: T[],
    cursorColumn: keyof T,
    pageSize?: number,
  ) {
    const hasMore = data.length === pageSize;
    const requestedData = hasMore ? data.slice(0, -1) : data;

    const lastChat = pageSize ? data.at(pageSize) : undefined;
    const nextCursor = hasMore ? lastChat?.[cursorColumn] : undefined;

    return {
      data: requestedData,
      next: nextCursor,
    };
  }
}
