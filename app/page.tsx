"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

interface FeaturedBundle {
  uuid: string;
  displayName: string;
  displayNameSubText: null;
  description: string;
  extraDescription: null;
  promoDescription: null;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string;
  assetPath: string;
}
interface Item {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string;
  displayIcon: string;
  displayIcon2: string;
  assetPath: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [featured, setFeatured] = useState<FeaturedBundle | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const fetchItems = async () => {
    try {
      const data = await fetch("/api/valorant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const json = await data.json();
      const featured = await axios.get(
        `https://valorant-api.com/v1/bundles/${json.data.FeaturedBundle.Bundle.DataAssetID}`
      );
      setFeatured(featured.data.data);
      setItems(json.data);
      fetchSkinPanel(json.data.SkinsPanelLayout.SingleItemOffers);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSkinPanel = async (items: []) => {
    const skins = items.map(async (item) => {
      const data = await axios.get(
        `https://valorant-api.com/v1/weapons/skinlevels/${item}`
      );
      return data.data.data;
    });

    const data = await Promise.all(skins);
    setItems(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 relative ">
      {featured && (
        <section className="h-[70vh] w-full  border border-white relative">
          <h1 className="text-5xl uppercase z-50 tracking-[0.50rem] top-10 left-10 font-bold absolute">
            {featured?.displayName}
          </h1>
          <Image
            src={featured?.displayIcon}
            alt="Featured item"
            fill
            className="object-contain"
          />
        </section>
      )}
      <section className="w-full h-full">
        <div className="grid grid-cols-4 gap-4">
          {items.length > 0 &&
            items?.map((item) => (
              <div
                key={item?.uuid}
                className="max-w-sm flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Image
                  src={item?.displayIcon}
                  alt="Featured item"
                  width="200"
                  height="0"
                  sizes="80vw"
                  className=" h-auto"
                />
                <div className="p-5">
                  <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {item?.displayName}
                  </h5>
                </div>
              </div>
            ))}
        </div>
      </section>
      <div>
        <div className="grid gap-6  md:grid-cols-1">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={fetchItems}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-1"
        >
          Fetch Items
        </button>
      </div>
    </main>
  );
}
