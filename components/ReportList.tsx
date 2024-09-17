"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
  Search,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
interface InjuryReport {
  id: number;
  reporterName: string;
  injuryDateTime: string;
  reportDateTime: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = "reporterName" | "injuryDateTime" | "reportDateTime";

export default function InjuryReportList() {
  const [sortField, setSortField] = useState<SortField>("reportDateTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [injuryDateStart, setInjuryDateStart] = useState("");
  const [injuryDateEnd, setInjuryDateEnd] = useState("");
  const [reportDateStart, setReportDateStart] = useState("");
  const [reportDateEnd, setReportDateEnd] = useState("");
  const [data, setData] = useState<InjuryReport[]>([]);
  let router = useRouter();
  let { user } = useUser();

  let {
    data: fetchedData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["report"],
    queryFn: async () => {
      let response = await fetch("/api/reports");
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        return data;
      }
    },
  });

  let { mutate: deleteReport } = useMutation({
    mutationFn: async (id: Number) => {
      await fetch(`/api/reports/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    onSuccess: () => {
      toast.success("Report Succesfully Deleted");
      refetch();
    },
  });

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  // Handle deleting a report
  const handleDelete = (id: number) => {
    deleteReport(id);
  };

  // Handle updating a report
  const handleUpdate = (id: number) => {
    router.push(`/reports/${id}`);
  };

  const sortedAndFilteredData = useMemo(() => {
    return data
      .filter(
        (report) =>
          report.reporterName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (!injuryDateStart || report.injuryDateTime >= injuryDateStart) &&
          (!injuryDateEnd || report.injuryDateTime <= injuryDateEnd) &&
          (!reportDateStart || report.reportDateTime >= reportDateStart) &&
          (!reportDateEnd || report.reportDateTime <= reportDateEnd)
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    data,
    sortField,
    sortDirection,
    searchTerm,
    injuryDateStart,
    injuryDateEnd,
    reportDateStart,
    reportDateEnd,
  ]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-row justify-center items-center mt-[10rem] ">
        Loading
        <span>
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-4xl relative z-20 md:text-7xl font-bold text-center text-black dark:text-white font-sans">
        <div className="gap-14 h-screen w-full flex flex-col justify-center items-center ">
          <div className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">
              Dashboard for all your reports, So get started
            </span>
          </div>
          {user ? (
            <Link
              href={"/injuryReport"}
              className={cn(
                buttonVariants(),
                "flex transform h-14 bg-white text-base text-black hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow duration-300 hover:shadow-xl hover:bg-while-200 max-w-xs w-full "
              )}
            >
              Create Report <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          ) : (
            <Link
              href={"/api/auth/login"}
              className={cn(
                buttonVariants(),
                "flex transform h-14 bg-white text-base text-black hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow duration-300 hover:shadow-xl hover:bg-while-200 max-w-xs w-full "
              )}
            >
              Get Started <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 ">Injury Reports</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search by Name</Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div>
          <Label htmlFor="injuryDateStart">Injury Date Range</Label>
          <div className="flex space-x-2">
            <Input
              id="injuryDateStart"
              type="date"
              value={injuryDateStart}
              onChange={(e) => setInjuryDateStart(e.target.value)}
            />
            <Input
              id="injuryDateEnd"
              type="date"
              value={injuryDateEnd}
              onChange={(e) => setInjuryDateEnd(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="reportDateStart">Report Date Range</Label>
          <div className="flex space-x-2">
            <Input
              id="reportDateStart"
              type="date"
              value={reportDateStart}
              onChange={(e) => setReportDateStart(e.target.value)}
            />
            <Input
              id="reportDateEnd"
              type="date"
              value={reportDateEnd}
              onChange={(e) => setReportDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("reporterName")}
                >
                  Name
                  <SortIcon field="reporterName" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("injuryDateTime")}
                >
                  Injury Date & Time
                  <SortIcon field="injuryDateTime" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("reportDateTime")}
                >
                  Report Date & Time
                  <SortIcon field="reportDateTime" />
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredData.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.reporterName}</TableCell>
                <TableCell>
                  {new Date(report.injuryDateTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(report.reportDateTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdate(report.id)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
