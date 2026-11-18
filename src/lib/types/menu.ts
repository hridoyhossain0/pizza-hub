
export interface MenuItem {
    _id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    location: string;
    vendor: {
        name: string;
        image?: string;
    };
    status: "pending" | "approved" | "rejected";
    isActive: boolean;
}