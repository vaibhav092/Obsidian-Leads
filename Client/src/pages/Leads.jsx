import Logout from '@/components/Logout';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leadApi } from '../util/api';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import { myDarkTheme } from '@/components/Darktheme';
import LeadModal from '@/components/LeadModal';


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
                const response = await leadApi.getAll({
                    params: { page, limit },
                });
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
    }, [page, limit, navigate]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Lead Management System
                        </h1>
                        <p className="text-blue-200">
                            Welcome back, {user?.firstName || 'User'}!
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleHomeClick}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Home
                        </button>
                        <Logout />
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-blue-200">Leads Overview</h2>
                        <div className="flex items-center space-x-4">
                            {loading && (
                                <div className="flex items-center space-x-2 text-blue-300">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                    <span>Updating...</span>
                                </div>
                            )}
                            <button
                                onClick={handleCreateLead}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                + Create New Lead
                            </button>
                        </div>
                    </div>
                    
                    <div className="ag-theme-quartz-dark" style={{ 
                        height: '70vh', 
                        width: '100%',
                        overflow: 'auto'
                    }}>
                        <AgGridReact
                            theme={myDarkTheme}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="single"
                            domLayout="normal"
                            onCellValueChanged={onCellValueChanged}
                            suppressRowClickSelection={true}
                            suppressCellFocus={false}
                            suppressRowHoverHighlight={false}
                            rowHeight={50}
                            headerHeight={50}
                            suppressLoadingOverlay={true}
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


                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">

                        <div className="text-sm text-gray-300">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} records
                        </div>


                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">Show:</span>
                            <select
                                value={limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-sm text-gray-300">per page</span>
                        </div>


                        <div className="flex items-center space-x-2">

                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>


                            <div className="flex items-center space-x-1">
                                {getPageNumbers().map((pageNum, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                                        disabled={pageNum === '...'}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            pageNum === page
                                                ? 'bg-blue-600 text-white'
                                                : pageNum === '...'
                                                ? 'text-gray-500 cursor-default'
                                                : 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>


                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
