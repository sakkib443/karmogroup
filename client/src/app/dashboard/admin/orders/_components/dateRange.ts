/** A date preset → the start and end of those local days, as ISO moments for the server. */
export function dateRange(preset: string, from: string, to: string): { from?: string; to?: string } {
    const sod = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
    const eod = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };
    const now = new Date();
    const ago = (n: number) => { const x = new Date(now); x.setDate(x.getDate() - n); return x; };
    let a: Date | undefined;
    let b: Date | undefined;
    switch (preset) {
        case 'today': a = sod(now); b = eod(now); break;
        case 'yesterday': a = sod(ago(1)); b = eod(ago(1)); break;
        case '7d': a = sod(ago(6)); b = eod(now); break;
        case '30d': a = sod(ago(29)); b = eod(now); break;
        case 'this_month': a = new Date(now.getFullYear(), now.getMonth(), 1); b = eod(now); break;
        case 'last_month': a = new Date(now.getFullYear(), now.getMonth() - 1, 1); b = eod(new Date(now.getFullYear(), now.getMonth(), 0)); break;
        case 'custom':
            if (from) a = sod(new Date(`${from}T00:00:00`));
            if (to) b = eod(new Date(`${to}T00:00:00`));
            break;
    }
    return { from: a?.toISOString(), to: b?.toISOString() };
}
