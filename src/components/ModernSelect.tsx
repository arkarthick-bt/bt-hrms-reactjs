import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CFormLabel, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilChevronBottom, cilCheck } from '@coreui/icons';

interface Option {
  id: string | number;
  name: string;
}

interface ModernSelectProps {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onOpen?: () => void;
  required?: boolean;
}

const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  loading = false,
  onSearch,
  onOpen,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && onOpen) {
      onOpen();
    }
  }, [isOpen]); // Only fire when isOpen changes

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);


  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (onSearch) {
      searchTimeout.current = setTimeout(() => {
        onSearch(query);
      }, 300);
    }
  };


  const handleSelect = (option: Option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="modern-select-container mb-3" ref={dropdownRef}>
      {label && <CFormLabel className="small text-muted fw-semibold mb-2">{label} {required && '*'}</CFormLabel>}
      
      <div 
        className={`select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-primary' : 'text-muted'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <div className="d-flex align-items-center gap-2">
            {loading && <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />}
            <CIcon icon={cilChevronBottom} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="select-dropdown shadow-lg">
          <div className="search-wrapper p-2">
            <CIcon icon={cilSearch} className="search-icon text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="options-list">
            {options.length === 0 ? (
              <div className="no-options p-3 text-center text-muted small">
                {loading ? 'Searching...' : 'No options found'}
              </div>
            ) : (
              options.map(option => (
                <div 
                  key={option.id} 
                  className={`option-item ${option.id === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option.name}</span>
                  {option.id === value && <CIcon icon={cilCheck} className="text-primary ms-auto" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .modern-select-container {
          position: relative;
          width: 100%;
          user-select: none;
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(var(--cui-tertiary-bg-rgb), 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.5);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
          font-weight: 600;
          height: 48px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .select-trigger:hover {
          border-color: var(--cui-primary);
          background: rgba(var(--cui-tertiary-bg-rgb), 0.5);
        }

        .select-trigger.open {
          border-color: var(--cui-primary);
          box-shadow: 0 0 0 4px rgba(var(--cui-primary-rgb), 0.15),
                      0 8px 24px rgba(0,0,0,0.1);
          background: var(--surface);
          transform: translateY(-2px);
        }

        .chevron-icon {
          width: 14px;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          color: var(--cui-text-muted);
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
          color: var(--cui-primary);
        }

        .select-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--surface);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.5);
          border-radius: 16px;
          z-index: 1000;
          max-height: 320px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .search-wrapper {
          position: relative;
          padding: 12px;
          border-bottom: 1px solid rgba(var(--cui-border-color-rgb), 0.2);
          background: rgba(var(--cui-tertiary-bg-rgb), 0.2);
        }

        .dropdown-search-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.3);
          border-radius: 10px;
          background: var(--surface);
          color: var(--cui-text-emphasis);
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
        }

        .dropdown-search-input:focus {
          border-color: var(--cui-primary);
          box-shadow: 0 0 0 3px rgba(var(--cui-primary-rgb), 0.1);
        }

        .search-icon {
          position: absolute;
          left: 22px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          opacity: 0.5;
        }

        .options-list {
          overflow-y: auto;
          flex: 1;
          padding: 6px;
        }

        .option-item {
          padding: 10px 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 8px;
          margin-bottom: 2px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--cui-text-emphasis);
        }

        .option-item:hover {
          background: var(--surface-hover);
          color: var(--cui-primary);
          padding-left: 18px;
        }

        .option-item.selected {
          background: rgba(var(--cui-primary-rgb), 0.1);
          color: var(--cui-primary);
          font-weight: 700;
        }

        /* Customize Scrollbar */
        .options-list::-webkit-scrollbar {
          width: 5px;
        }
        .options-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .options-list::-webkit-scrollbar-thumb {
          background: rgba(var(--cui-border-color-rgb), 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ModernSelect;
