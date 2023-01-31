export function abort(
    message: string | null,
    fileName: string | null,
    lineNumber: u32,
    columnNumber: u32
): void { }

export function alloc(size: usize): usize {
    return heap.alloc(size);
}

export function freeResource(rid: i32): void {
    heap.free(rid);
}