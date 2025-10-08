"use client";
import { Outlet } from "react-router-dom";
import Header from "../_components/Header";

export default function RouterApp() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
