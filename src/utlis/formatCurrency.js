export const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PKR",
    }).format(n);