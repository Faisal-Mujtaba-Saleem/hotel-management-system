"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

const orders = [
  {
    image: "https://i.postimg.cc/KYGtGJT0/Deluxe-Twin-1-min.jpg",
    roomId: "1096",
    orderId: "ORD3554",
    email: "uttamsdev@gmail.com",
    startDate: "2025-10-09",
    endDate: "2025-10-09",
    price: "5150TK",
  },
  {
    image: "https://i.postimg.cc/63SZhKmP/16256-113891-f65416994-3xl.jpg",
    roomId: "1092",
    orderId: "ORD89802",
    email: "uttamsdev@gmail.com",
    startDate: "2025-10-10",
    endDate: "2025-10-30",
    price: "45150TK",
  },
  {
    image: "https://i.postimg.cc/63SZhKmP/16256-113891-f65416994-3xl.jpg",
    roomId: "1092",
    orderId: "ORD35672",
    email: "uttamsdev@gmail.com",
    startDate: "2025-10-07",
    endDate: "2025-10-07",
    price: "2150TK",
  },
  {
    image: "https://i.postimg.cc/gjZZS592/16256-113891-f65416992-3xl.jpg",
    roomId: "1090",
    orderId: "ORD76131",
    email: "john.sokpo@gmail.com",
    startDate: "2025-07-15",
    endDate: "2025-07-18",
    price: "4650TK",
  },
  {
    image: "https://i.postimg.cc/hG2TfTbc/Deluxe-2-min-1.jpg",
    roomId: "1094",
    orderId: "ORD19285",
    email: "uttamsdev@gmail.com",
    startDate: "2025-06-20",
    endDate: "2025-06-20",
    price: "3150TK",
  },
  {
    image: "https://i.postimg.cc/0r1JLfxd/16256-113891-f65416992-3xl-1.jpg",
    roomId: "1091",
    orderId: "ORD97938",
    email: "jackodevid@gmail.com",
    startDate: "2024-12-17",
    endDate: "2024-12-17",
    price: "1850TK",
  },
  {
    image: "https://i.postimg.cc/g2Pv5Y2F/Deluxe-3-min.jpg",
    roomId: "1095",
    orderId: "ORD23208",
    email: "jackodevid@gmail.com",
    startDate: "2024-12-16",
    endDate: "2024-12-18",
    price: "8300TK",
  },
  {
    image: "https://i.postimg.cc/9F9dJ4VY/Deluxe-1-min-1.jpg",
    roomId: "1093",
    orderId: "ORD96781",
    email: "jackodevid@gmail.com",
    startDate: "2024-12-16",
    endDate: "2024-12-16",
    price: "1150TK",
  },
];

export default function RecentOrders() {
  return (
    <div>
      <p className="text-lg mb-2 font-medium">Recent Orders</p>

      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="table w-full mx-auto">
          <thead className="bg-[#0284c7] text-white text-sm">
            <tr>
              {/* <div className="flex justify-center items-center"> */}
                <th className="p-3 text-start">Image</th>
                <th className="p-3 text-start">Room ID</th>
                <th className="p-3 text-start">Order ID</th>
                <th className="p-3 text-start">Guests</th>
                <th className="p-3 text-start">Start Date</th>
                <th className="p-3 text-start">End Date</th>
                <th className="p-3 text-start">Price</th>
                <th className="text-center py-3 w-[80px]">Action</th>
              {/* </div> */}
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="hover border-y border-gray-200">
                <td className="py-3">
                  <img
                    src={order.image}
                    alt={order.roomId}
                    className="w-20 h-auto rounded object-cover px-3"
                  />
                </td>
                <td className="px-3">{order.roomId}</td>
                <td className="px-3">{order.orderId}</td>
                <td className="px-3">{order.email}</td>
                <td className="px-3">{order.startDate}</td>
                <td className="px-3">{order.endDate}</td>
                <td className="px-3">{order.price}</td>
                <td className="px-3">
                  <button className="bg-red-500 hover:bg-red-600 flex justify-center p-1 rounded mx-auto">
                    <TrashIcon className="w-5 h-5 text-white cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
