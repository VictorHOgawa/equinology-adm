"use client";
import { authGetAPI, token } from "@/lib/axios";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DashBoardCard } from "./HomeDashBoardCards";

interface Items {
  monthlyValue: number;
  signatureTotalQuantity: number;
  totalSignatureValue: number;
  totalInfluencerQuantity: number;
  activeInfluencerQuantity: number;
  inactiveInfluencerQuantity: number;
  newInfluencerQuantity: number;
}

export function DashBoard() {
  const cookies = useCookies();
  const Token = cookies.get(token);
  const [items, setItems] = useState<Items>({
    monthlyValue: 0,
    signatureTotalQuantity: 0,
    totalSignatureValue: 0,
    totalInfluencerQuantity: 0,
    activeInfluencerQuantity: 0,
    inactiveInfluencerQuantity: 0,
    newInfluencerQuantity: 0,
  });

  async function handleGetSignatureStatistics() {
    try {
      const response = await authGetAPI("/signature/statistics", Token);
      if (response.status === 200) {
        setItems((prevState) => ({
          ...prevState,
          monthlyValue: response.body.statistics.monthlyValue,
          signatureTotalQuantity: response.body.statistics.total,
          totalSignatureValue: response.body.statistics.totalValue,
        }));
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetInfluencerStatistics() {
    try {
      const response = await authGetAPI("/influencer/statistics", Token);
      if (response.status === 200) {
        setItems((prevState) => ({
          ...prevState,
          totalInfluencerQuantity: response.body.statistics.total,
          activeInfluencerQuantity: response.body.statistics.active,
          inactiveInfluencerQuantity: response.body.statistics.inactive,
          newInfluencerQuantity: response.body.statistics.new,
        }));
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetSignatureStatistics();
    handleGetInfluencerStatistics();
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 md:p-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-[#252F40]">Dashboard</h1>
      </div>
      <div className="flex w-full flex-row overflow-x-auto">
        <div className="flex w-full gap-8 py-4 pr-4">
          <DashBoardCard
            quantity={items.signatureTotalQuantity}
            title={"Total de assinaturas"}
            icon={
              <Image
                src={"/dashboard/1.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.monthlyValue}
            title={"Receita mensal"}
            icon={
              <Image
                src={"/dashboard/2.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.totalSignatureValue}
            title={"Receita total"}
            icon={
              <Image
                src={"/dashboard/3.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.totalInfluencerQuantity}
            title={"Total de influenciadores"}
            icon={
              <Image
                src={"/dashboard/4.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.newInfluencerQuantity}
            title={"Novos Influenciadores"}
            icon={
              <Image
                src={"/dashboard/7.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.activeInfluencerQuantity}
            title={"Influenciadores ativos"}
            icon={
              <Image
                src={"/dashboard/5.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
          <DashBoardCard
            quantity={items.inactiveInfluencerQuantity}
            title={"Influenciadores inativos"}
            icon={
              <Image
                src={"/dashboard/6.svg"}
                className={`h-full w-full`}
                alt={""}
                width={100}
                height={100}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
