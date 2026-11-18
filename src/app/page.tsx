import Banner from "@/components/HomePage/Banner";
import FeaturedMenu from "@/components/HomePage/FeaturedMenu";
import HowItWorks from "@/components/HomePage/HowItWorks";
import PizzaCategories from "@/components/HomePage/PizzaCategories";
import WhyChooseUs from "@/components/HomePage/WhyChooseUs";
import { getFeaturedMenuItems } from "@/lib/data";

// Featured items come from the database on every request.
export const instant = false;

export default async function Home() {
    const featured = await getFeaturedMenuItems(6);

    const items = featured.map((item) => ({
        _id: item._id,
        name: item.name,
        image: item.image,
        category: item.category,
        price: item.price,
        location: item.location,
        status: item.status,
        isActive: item.isActive,
        premium: item.premium,
        vendor: {
            name: item.vendorName,
            image: item.vendorImage,
        },
    }));

    return (
        <div>
            <Banner />
            <FeaturedMenu items={items} />
            <PizzaCategories />
            <WhyChooseUs />

            <HowItWorks />
        </div>
    );
}
