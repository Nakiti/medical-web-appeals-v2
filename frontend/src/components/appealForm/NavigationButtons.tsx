import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  nextHref: string;
  backHref: string;
  isLoading?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  nextHref, 
  backHref, 
  isLoading = false 
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between mt-10 gap-4">
      {/* Back Button */}
      <Link
        href={backHref}
        className="flex-1 text-center rounded-full py-3 px-6 bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition duration-200 shadow-sm"
      >
        Back
      </Link>

      {/* Next Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 rounded-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-base hover:opacity-90 transition duration-200 shadow-md disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Next"}
      </Button>
    </div>
  );
};

export default NavigationButtons;