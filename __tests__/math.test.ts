function add(a: number, b: number): number {
    return a + b;
}

describe('Basic Arithmetic', () => {
    it('should add two numbers correctly', () => {
        expect(add(1, 2)).toBe(3);
    });
});
