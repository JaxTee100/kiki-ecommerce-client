'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const itemsData = [
  { id: 1, name: "Shoes", price: 1.5, image: "/images/shoes.jpg" },
  { id: 2, name: "Shirt", price: 2.0, image: "/images/shoes.jpg" },
  { id: 3, name: "Jeans", price: 2.5, image: "/images/shoes.jpg" },
  { id: 4, name: "Hat", price: 1.0, image: "/images/shoes.jpg" },
  { id: 5, name: "Jacket", price: 3.0, image: "/images/shoes.jpg" },
  { id: 6, name: "Socks", price: 0.5, image: "/images/shoes.jpg" },
  { id: 7, name: "Scarf", price: 1.2, image: "/images/shoes.jpg" },
];

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateOrder() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add item to the cart
  const handleAddToCart = (item) => {
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }
  };

  // Adjust quantity of item in the cart
  const handleQuantityChange = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Calculate the total amount
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle the submission of the order
  const handleGenerateInvoice = async () => {
    setLoading(true);
    setError(null);

    // Construct order data
    const orderData = {
      customerName: name,
      customerEmail: email,
      items: cart.map((item) => ({
        description: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      dueDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${baseApiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      alert(`Invoice created successfully! Invoice ID: ${data._id}`);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Create Your Order</h2>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {itemsData.map((item) => (
            <div key={item.id} className="bg-blue-50 p-4 rounded-xl shadow-md text-center">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="mx-auto rounded"
              />
              <h3 className="text-lg font-bold mt-2">{item.name}</h3>
              <p className="text-blue-700">${item.price.toFixed(2)}</p>
              <Button onClick={() => handleAddToCart(item)} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Your Cart</h3>
            <ul className="list-disc list-inside">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>{item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</span>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-20"
                  />
                </li>
              ))}
            </ul>
            <div className="mt-4 text-lg font-semibold text-blue-800">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled>
              Generating Invoice...
            </Button>
          ) : (
            <Button onClick={handleGenerateInvoice} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Generate Order Invoice
            </Button>
          )}

          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
