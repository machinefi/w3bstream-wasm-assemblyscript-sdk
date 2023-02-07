export function alloc(size: usize): usize {
    return heap.alloc(size);
}

export function freeResource(rid: i32): void {
    heap.free(rid);
}