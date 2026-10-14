import { useState } from "react";
import { Check, ChevronRight, School, Sparkles, X } from "lucide-react";
import { type CollegeId, COLLEGES } from "@/lib/college-theme";
import { CollegeLogo } from "./CollegeLogo";

export function CollegeSelectorModal({
  isOpen,
  onClose,
  currentCollegeId,
  onSelectCollege,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentCollegeId: CollegeId;
  onSelectCollege: (id: CollegeId) => void;
}) {
  if (!isOpen) return null;

  const collegesList = Object.values(COLLEGES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-10 flex flex-col font-sans">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-900 text-white grid place-items-center">
              <School className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Select University / Institution
                </h2>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  8 Campuses Live
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Layout, ribbon finish, button geometry, and typography adapt automatically to your college.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 grid place-items-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* College Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {collegesList.map((college) => {
            const isSelected = college.id === currentCollegeId;

            return (
              <div
                key={college.id}
                onClick={() => {
                  onSelectCollege(college.id);
                  onClose();
                }}
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between group ${
                  isSelected
                    ? "border-gray-900 bg-gray-50/80 shadow-md ring-2 ring-gray-900/10"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 shadow-xs"
                }`}
              >
                {/* Active Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-gray-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                    <span>Active</span>
                  </div>
                )}

                <div>
                  {/* Top Bar with Logo & Color Swatches */}
                  <div className="flex items-center justify-between mb-3">
                    <CollegeLogo collegeId={college.id} showText={false} />
                    <div className="flex items-center gap-1.5 mr-16">
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 inline-block shadow-xs"
                        style={{ backgroundColor: college.colors.primary }}
                        title="Primary Color"
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-black/10 inline-block shadow-xs"
                        style={{ backgroundColor: college.colors.secondary }}
                        title="Secondary Color"
                      />
                      {college.colors.accent && (
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 inline-block shadow-xs"
                          style={{ backgroundColor: college.colors.accent }}
                          title="Accent Color"
                        />
                      )}
                    </div>
                  </div>

                  {/* University Name & Tagline */}
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-0.5 font-medium">
                    {college.tagline}
                  </p>

                  {/* Specs & Style Highlights */}
                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">
                        Typography
                      </span>
                      <span className="font-semibold text-gray-800">{college.fontName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">
                        Buttons
                      </span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {college.buttonStyle.variant} ({college.buttonStyle.radiusClass})
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">
                        Ribbon Style
                      </span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {college.ribbonStyle.variant}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">
                        ID Format
                      </span>
                      <span className="font-semibold text-gray-800">
                        {college.studentIdLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch Action Preview */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-500">{college.campuses.length} Campuses</span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isSelected ? "text-gray-900 font-bold" : "text-blue-600 group-hover:translate-x-0.5 transition-transform"
                    }`}
                  >
                    {isSelected ? "Current Theme" : "Apply Layout"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
