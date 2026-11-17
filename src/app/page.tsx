import Banner from "@/components/HomePage/Banner";
import FeaturedMenu from "@/components/HomePage/FeaturedMenu";
import HowItWorks from "@/components/HomePage/HowItWorks";
import PizzaCategories from "@/components/HomePage/PizzaCategories";
import WhyChooseUs from "@/components/HomePage/WhyChooseUs";

const demoMenuItems: MenuItem[] = [
  {
    _id: "1",
    name: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    category: "Pizza",
    price: 450,
    location: "Dhaka, Bangladesh",
    vendor: {
      name: "Pizza House",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "2",
    name: "Pepperoni Special Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    category: "Special Pizza",
    price: 650,
    location: "Brahmanbaria, Bangladesh",
    vendor: {
      name: "Food Corner",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "3",
    name: "Chicken Cheese Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Burger",
    price: 280,
    location: "Dhaka, Bangladesh",
    vendor: {
      name: "Burger Zone",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "4",
    name: "Delicious Cheese Pizza",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47",
    category: "Pizza",
    price: 550,
    location: "Chittagong, Bangladesh",
    vendor: {
      name: "Italian Kitchen",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "5",
    name: "Fresh Chicken Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    category: "Sandwich",
    price: 220,
    location: "Sylhet, Bangladesh",
    vendor: {
      name: "Fresh Bites",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "6",
    name: "Deluxe Beef Burger",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    category: "Burger",
    price: 350,
    location: "Dhaka, Bangladesh",
    vendor: {
      name: "Burger King",
    },
    status: "approved",
    isActive: true,
  },
];

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedMenu items={demoMenuItems} />
      <PizzaCategories />
      <WhyChooseUs />

      <HowItWorks />


    </div>
  );
}
