"use client";

import React, { useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import type { ProductWithImages } from "@/types";
import { useSearchParams } from "next/navigation";

const AllProductsClient: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory
  } = useAppContext() as {
    products: ProductWithImages[];
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
  };

  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, categories, setSelectedCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category?.name === selectedCategory);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-32 gap-8">

        {/* Filter: top on small, right sidebar on md+ */}
        <aside
          className="
            order-1 md:order-2
            w-full md:w-64 lg:w-72
            mt-6 md:mt-12
            pb-4 md:pb-0
            border-b md:border-b-0 md:border-l
            md:pl-6
          "
        >
          <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
          <div className="flex gap-2 overflow-x-auto md:overflow-visible md:flex-col">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-left px-3 py-2 rounded-md transition
                  ${selectedCategory === cat
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <main className="order-2 md:order-1 flex-1">
          <div className="flex flex-col items-end pt-12">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id ?? index} product={product} />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AllProductsClient;
