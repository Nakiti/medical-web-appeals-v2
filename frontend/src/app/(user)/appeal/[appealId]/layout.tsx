"use client"
import Header from "@/components/appealForm/AppealFormHeader";
import ProgressBar from "@/components/appealForm/AppealFormProgressBar";
import {use} from "react"

export default function AppealFormLayout({params, children}) {
    const unwrappedParams = use(params)
    const appealId = unwrappedParams.appealId

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-slate-100 text-gray-800">      
            <Header />
            <ProgressBar appealId={appealId}/>
            {children}
        </div>
    )
}