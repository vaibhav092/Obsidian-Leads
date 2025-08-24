import Logout from '@/components/Logout';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leadApi } from '../util/api';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import { myDarkTheme } from '@/components/Darktheme';
import LeadModal from '@/components/LeadModal';
import FilterField from '@/components/FilterField';


ModuleRegistry.registerModules([AllCommunityModule]);

function Leads() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [limit, setLimit] = useState(20);
    const [page, setPage] = useState(1);
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        state: '',
        source: 'other',
        status: 'new',
        score: 0,
        leadValue: '',
        isQualified: false
    });

    const filterConfig = {
        email: { label: 'Email', type: 'text', operators: ['equals', 'contains'] },
        company: { label: 'Company', type: 'text', operators: ['equals', 'contains'] },
        city: { label: 'City', type: 'text', operators: ['equals', 'contains'] },
        status: { label: 'Status', type: 'select', operators: ['equals', 'in'], options: ['new', 'contacted', 'qualified', 'lost', 'won'] },
        source: { label: 'Source', type: 'select', operators: ['equals', 'in'], options: ['website', 'social_media', 'referral', 'cold_call', 'other'] },
        score: { label: 'Score', type: 'number', operators: ['equals', 'gt', 'lt', 'between'] },
        leadValue: { label: 'Lead Value', type: 'number', operators: ['equals', 'gt', 'lt', 'between'] },
        createdAt: { label: 'Created Date', type: 'date', operators: ['on', 'before', 'after', 'between'] },
        lastActivityAt: { label: 'Last Activity', type: 'date', operators: ['on', 'before', 'after', 'between'] },
        isQualified: { label: 'Qualified', type: 'boolean', operators: ['equals'], options: [true, false] }
    };

    const defaultColDef = {
        flex: 1,
        minWidth: 120,
        sortable: true,
        filter: false,
        resizable: true,
        editable: false,
        suppressMenu: true,
    };


    const columnDefs = [
        {
            field: 'firstName',
            headerName: 'First Name',
            minWidth: 120,
            cellStyle: { fontWeight: '500' }
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            minWidth: 120,
            cellStyle: { fontWeight: '500' }
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            cellStyle: { color: '#60a5fa' }
        },
        {
            field: 'phone',
            headerName: 'Phone',
            minWidth: 130
        },
        {
            field: 'company',
            headerName: 'Company',
            minWidth: 150
        },
        {
            field: 'city',
            headerName: 'City',
            minWidth: 100
        },
        {
            field: 'state',
            headerName: 'State',
            minWidth: 80
        },
        {
            field: 'source',
            headerName: 'Source',
            minWidth: 120,
            cellStyle: { textTransform: 'capitalize' }
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['new', 'contacted', 'qualified', 'lost', 'won']
            },
            cellStyle: (params) => {
                const statusColors = {
                    'new': { backgroundColor: '#1e3a8a', color: '#dbeafe' },
                    'contacted': { backgroundColor: '#581c87', color: '#e9d5ff' },
                    'qualified': { backgroundColor: '#065f46', color: '#d1fae5' },
                    'lost': { backgroundColor: '#991b1b', color: '#fecaca' },
                    'won': { backgroundColor: '#166534', color: '#dcfce7' }
                };
                return statusColors[params.value] || {};
            }
        },
        {
            field: 'score',
            headerName: 'Score',
            minWidth: 80,
            type: 'numericColumn',
            cellStyle: { textAlign: 'center' }
        },
        {
            field: 'leadValue',
            headerName: 'Lead Value',
            minWidth: 120,
            type: 'numericColumn',
            valueFormatter: (params) => {
                return params.value ? `$${params.value.toLocaleString()}` : '-';
            }
        },
        {
            field: 'isQualified',
            headerName: 'Qualified',
            minWidth: 100,
            editable: true,
            cellRenderer: 'agCheckboxCellRenderer',
            cellStyle: { textAlign: 'center' }
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            minWidth: 120,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString();
            }
        },
        {
            field: 'lastActivityAt',
            headerName: 'Last Activity',
            minWidth: 120,
            valueFormatter: (params) => {
                return params.value ? new Date(params.value).toLocaleDateString() : '-';
            }
        },
        {
            headerName: 'Actions',
            minWidth: 120,
            maxWidth: 120,
            sortable: false,
            filter: false,
            editable: false,
            cellRenderer: (params) => (
                <div className="flex space-x-1">
                    <button
                        onClick={() => handleEditLead(params.data)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                        title="Edit lead"
                    >
                        Edit
                    </button>
                </div>
            ),
            cellStyle: { textAlign: 'center' }
        }
    ];


    const onCellValueChanged = useCallback(async (params) => {
        const { data, field, newValue } = params;
        
        try {
            setLoading(true);
            await leadApi.update(data.id, { [field]: newValue });
            

            setRowData(prevData => 
                prevData.map(row => 
                    row.id === data.id ? { ...row, [field]: newValue } : row
                )
            );
        } catch (error) {
            console.error('Failed to update lead:', error);

            params.node.setDataValue(field, params.oldValue);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const queryParams = { page, limit };
                
                Object.keys(filters).forEach(key => {
                    if (filters[key] && filters[key].operator && filters[key].value !== undefined) {
                        queryParams[key] = JSON.stringify(filters[key]);
                    }
                });
                
                const response = await leadApi.getAll(queryParams);
                setRowData(response.data);
                setTotalPages(response.totalPages || 1);
                setTotalRecords(response.total || 0);
            } catch (error) {
                console.error('Error fetching leads:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, limit, filters, navigate]);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const handleCreateLead = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            company: '',
            city: '',
            state: '',
            source: 'other',
            status: 'new',
            score: 0,
            leadValue: '',
            isQualified: false
        });
        setShowCreateModal(true);
    };

    const handleEditLead = (lead) => {
        setSelectedLead(lead);
        setFormData({
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone || '',
            company: lead.company || '',
            city: lead.city || '',
            state: lead.state || '',
            source: lead.source,
            status: lead.status,
            score: lead.score,
            leadValue: lead.leadValue || '',
            isQualified: lead.isQualified
        });
        setShowEditModal(true);
    };

    const handleDeleteLead = async (leadId, firstName, lastName) => {
        const leadName = `${firstName} ${lastName}`;
        
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the lead "${leadName}"?\n\nThis action cannot be undone.`
        );
        
        if (!isConfirmed) {
            return;
        }
        
        try {
            setLoading(true);
            await leadApi.delete(leadId);
            
            setRowData(prevData => prevData.filter(lead => lead.id !== leadId));
            setTotalRecords(prev => prev - 1);
            
            const remainingRecordsOnPage = rowData.length - 1;
            if (remainingRecordsOnPage === 0 && page > 1) {
                setPage(prev => prev - 1);
            }
            
            setShowEditModal(false);
            alert(`Lead "${leadName}" has been deleted successfully.`);
            
        } catch (error) {
            console.error('Failed to delete lead:', error);
            alert(`Failed to delete lead "${leadName}". Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e, isEdit = false) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            

            const cleanFormData = {
                ...formData,
                score: parseInt(formData.score) || 0,
                leadValue: formData.leadValue ? parseFloat(formData.leadValue) : null,
                phone: formData.phone || null,
                company: formData.company || null,
                city: formData.city || null,
                state: formData.state || null
            };
            
            if (isEdit) {
                const response = await leadApi.update(selectedLead.id, cleanFormData);
                if (response.success) {
                    setRowData(prevData => 
                        prevData.map(lead => 
                            lead.id === selectedLead.id ? { ...lead, ...cleanFormData } : lead
                        )
                    );
                    setShowEditModal(false);
                    alert('Lead updated successfully!');
                } else {
                    throw new Error(response.message || 'Update failed');
                }
            } else {
                const response = await leadApi.create(cleanFormData);
                if (response.success) {
                    setRowData(prevData => [response.lead, ...prevData]);
                    setTotalRecords(prev => prev + 1);
                    setShowCreateModal(false);
                    alert('Lead created successfully!');
                } else {
                    throw new Error(response.message || 'Creation failed');
                }
            }
            

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                company: '',
                city: '',
                state: '',
                source: 'other',
                status: 'new',
                score: 0,
                leadValue: '',
                isQualified: false
            });
            
        } catch (error) {
            console.error('Failed to save lead:', error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} lead: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addFilter = (field, operator, value) => {
        if (value !== undefined && value !== '') {
            setFilters(prev => ({
                ...prev,
                [field]: { operator, value }
            }));
        }
    };

    const removeFilter = (field) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters({});
        setPage(1);
    };

    const handleFilterChange = (field, operator, value) => {
        if (value === undefined || value === '' || (Array.isArray(value) && value.every(v => v === ''))) {
            removeFilter(field);
            return;
        }

        if (operator === 'between' && Array.isArray(value)) {
            if (value.length === 2 && value[0] !== '' && value[1] !== '') {
                addFilter(field, operator, value);
            } else {
                removeFilter(field);
            }
        } else if (operator === 'in' && Array.isArray(value)) {
            if (value.length > 0 && value.some(v => v !== '')) {
                addFilter(field, operator, value.filter(v => v !== ''));
            } else {
                removeFilter(field);
            }
        } else if (value !== undefined && value !== '') {
            addFilter(field, operator, value);
        } else {
            removeFilter(field);
        }
        
        setPage(1);
    };

    const getActiveFiltersCount = () => {
        return Object.keys(filters).length;
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Obsidian Leads
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Welcome back, {user?.firstName || 'User'}!
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleHomeClick}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl transition-all duration-200 text-white font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-500/30"
                        >
                            Home
                        </button>
                        <Logout />
                    </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Leads Overview</h2>
                        <div className="flex items-center space-x-4">
                            {loading && (
                                <div className="flex items-center space-x-2 text-blue-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                                    <span className="font-medium">Updating...</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-5 py-3 rounded-xl transition-all duration-200 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                                    showFilters ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-pink-700 to-pink-800 hover:from-pink-600 hover:to-pink-700'
                                } ${getActiveFiltersCount() > 0 ? 'ring-2 ring-blue-400 shadow-blue-500/25' : ''}`}
                            >
                                🔍 Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                            </button>
                            <button
                                onClick={handleCreateLead}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-5 py-3 rounded-xl transition-all duration-200 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-green-500/30"
                            >
                                + Create New Lead
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mb-8 p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
                                <div className="flex items-center space-x-2">
                                    {getActiveFiltersCount() > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(filterConfig).map(([field, config]) => (
                                    <FilterField
                                        key={field}
                                        field={field}
                                        config={config}
                                        value={filters[field]}
                                        onChange={handleFilterChange}
                                        onRemove={() => removeFilter(field)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {getActiveFiltersCount() > 0 && (
                        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/40 rounded-2xl shadow-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-base text-blue-200 font-semibold">
                                    Active Filters ({getActiveFiltersCount()})
                                </span>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-400 hover:text-blue-300 underline font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3">
                                {Object.entries(filters).map(([field, filter]) => (
                                    <span
                                        key={field}
                                        className="inline-flex items-center px-3 py-2 bg-blue-600/40 border border-blue-500/60 rounded-full text-sm text-blue-100 font-medium shadow-lg"
                                    >
                                        {filterConfig[field]?.label}: {filter.operator} {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
                                        <button
                                            onClick={() => removeFilter(field)}
                                            className="ml-2 text-blue-300 hover:text-blue-100 transition-colors duration-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="ag-theme-quartz-dark rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl" style={{ 
                        height: '75vh', 
                        width: '100%'
                    }}>
                        <AgGridReact
                            theme={myDarkTheme}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="single"
                            domLayout="normal"
                            onCellValueChanged={onCellValueChanged}
                            suppressCellFocus={false}
                            suppressRowHoverHighlight={false}
                            rowHeight={50}
                            headerHeight={50}
                            suppressNoRowsOverlay={false}
                            noRowsOverlayComponent={() => (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="text-6xl mb-4">📊</div>
                                    <div className="text-xl font-medium">No leads found</div>
                                    <div className="text-sm">Create your first lead to get started</div>
                                </div>
                            )}
                        />
                    </div>


                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50 shadow-xl">

                        <div className="text-base text-gray-200 font-medium">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} records
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="text-base text-gray-200 font-medium">Show:</span>
                            <select
                                value={limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                                className="bg-gray-700 border border-gray-600 text-white text-base rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            >
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-base text-gray-200 font-medium">per page</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="px-4 py-2 text-base font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-2">
                                {getPageNumbers().map((pageNum, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                                        disabled={pageNum === '...'}
                                        className={`px-4 py-2 text-base font-semibold rounded-xl transition-all duration-200 ${
                                            pageNum === page
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                                                : pageNum === '...'
                                                ? 'text-gray-500 cursor-default'
                                                : 'text-gray-200 bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:shadow-lg'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="px-4 py-2 text-base font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <LeadModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Lead"
                formData={formData}
                onSubmit={(e) => handleFormSubmit(e, false)}
                onChange={handleInputChange}
                loading={loading}
                isEdit={false}
            />


            <LeadModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Lead"
                formData={formData}
                onSubmit={(e) => handleFormSubmit(e, true)}
                onChange={handleInputChange}
                loading={loading}
                isEdit={true}
                onDelete={handleDeleteLead}
                selectedLead={selectedLead}
            />
        </div>
    );
}



export default Leads;
