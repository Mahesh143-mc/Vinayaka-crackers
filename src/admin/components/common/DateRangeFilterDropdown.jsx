import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Filter } from 'lucide-react';
import { DATE_FILTER_OPTIONS } from '../../../utils/dateFilterUtil';

const DateRangeFilterDropdown = ({ 
  selectedFilter = 'all', 
  onFilterChange, 
  customStartDate = '', 
  customEndDate = '', 
  onCustomDatesChange,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(customStartDate);
  const [tempEnd, setTempEnd] = useState(customEndDate);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = DATE_FILTER_OPTIONS.find(o => o.id === selectedFilter) || DATE_FILTER_OPTIONS[0];

  const displayLabel = selectedFilter === 'custom' && customStartDate && customEndDate
    ? `${customStartDate} to ${customEndDate}`
    : activeOption.label;

  const handleSelectOption = (id) => {
    if (id !== 'custom') {
      onFilterChange(id);
      setIsOpen(false);
    } else {
      onFilterChange('custom');
    }
  };

  const handleApplyCustom = () => {
    if (tempStart && tempEnd) {
      if (onCustomDatesChange) {
        onCustomDatesChange(tempStart, tempEnd);
      }
      onFilterChange('custom');
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto px-4 py-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl text-xs sm:text-sm font-black text-gray-900 shadow-sm transition-all flex items-center justify-between gap-2.5 cursor-pointer whitespace-nowrap"
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar size={16} className="text-[#4A0E0E] shrink-0" />
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#4A0E0E]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
          <div className="px-2 py-1 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
            <span>Filter Period</span>
            <Calendar size={14} className="text-[#4A0E0E]" />
          </div>

          <div className="space-y-1">
            {DATE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  selectedFilter === opt.id
                    ? 'bg-[#4A0E0E] text-[#FFD700] shadow-sm'
                    : 'text-gray-800 hover:bg-amber-100/60'
                }`}
              >
                <span>{opt.label}</span>
                {selectedFilter === opt.id && <Check size={14} strokeWidth={3} className="shrink-0" />}
              </button>
            ))}
          </div>

          {selectedFilter === 'custom' && (
            <div className="pt-2 border-t border-amber-900/10 space-y-2">
              <div>
                <label className="block text-[10px] font-black text-[#4A0E0E] uppercase mb-1">From Date</label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-amber-900/20 rounded-lg text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#4A0E0E] uppercase mb-1">To Date</label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-amber-900/20 rounded-lg text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="w-full py-2 bg-[#4A0E0E] text-[#FFD700] hover:bg-[#380808] rounded-xl text-xs font-black shadow-sm mt-1 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Apply Custom Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilterDropdown;
