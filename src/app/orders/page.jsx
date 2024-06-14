"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { fetchOrders } from "../lib/firebase/firebase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrdersFromFirestore = async () => {
      const ordersList = await fetchOrders();
      setOrders(ordersList);
    };

    fetchOrdersFromFirestore();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }
    filtered = filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
    return filtered;
  }, [orders, sortBy, sortOrder, filterStatus]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="relative bg-white shadow-md overflow-auto min-h-screen p-2 rounded-3xl mt-2">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Mis Pedidos</h1>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4" />
                  Filtrar
                </Button>
              </DropdownTrigger>
              <DropdownMenu align="end" className="w-48">
                <DropdownItem>
                  <h2>Filtrar por estado</h2>
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("all")}>
                  Todos
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("pending")}>
                  Pendiente
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("paid")}>
                  Pagado
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("shipped")}>
                  Enviado
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("delivered")}>
                  Entregado
                </DropdownItem>
                <DropdownItem onClick={() => handleFilter("cancelled")}>
                  Cancelado
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th
                    className="px-4 py-3 text-left cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      Pedido
                      {sortBy === "id" && (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Fecha
                      {sortBy === "date" && (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Estado
                      {sortBy === "status" && (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      Total
                      {sortBy === "total" && (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href="#"
                        className="text-blue-500 hover:underline"
                        prefetch={false}
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.date.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : order.status === "paid"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {order.status === "pending"
                          ? "Pendiente"
                          : order.status === "shipped"
                          ? "Enviado"
                          : order.status === "delivered"
                          ? "Entregado"
                          : order.status === "paid"
                          ? "Pagado"
                          : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Dropdown>
                        <DropdownTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoveHorizontalIcon className="w-4 h-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu align="end">
                          <DropdownItem>Ver detalles</DropdownItem>
                          {order.status === "Pending" && (
                            <DropdownItem>Cancelar pedido</DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}

function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}
