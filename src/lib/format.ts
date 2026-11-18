export function formatCurrency(value: number) {
    return `৳${value.toLocaleString("en-BD", {
        maximumFractionDigits: 2,
    })}`;
}

export function formatDate(value: Date | string | null | undefined) {
    if (!value) {
        return "—";
    }

    const date = typeof value === "string" ? new Date(value) : value;

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatDateTime(value: Date | string | null | undefined) {
    if (!value) {
        return "—";
    }

    const date = typeof value === "string" ? new Date(value) : value;

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return `${formatDate(date)} · ${date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

/** Formats a `YYYY-MM-DD` delivery date without timezone shifts. */
export function formatDeliveryDate(value: string) {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
