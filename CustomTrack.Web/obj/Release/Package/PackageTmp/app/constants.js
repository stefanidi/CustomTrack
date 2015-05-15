'use strict';
/* Constants */


angular.module('bbApp.constants', [])
    .constant('categorySkills', {
        'Banking and Finance': ['Anti-Money Laundering', 'Acquisition and Leveraged Finance', 'Asset Finance and Leasing', 'Bank Advisory Work', 'Banking, Regulation and Finance', 'Cash CLOs', 'Corporate Lending and Loan Markets', 'Corporate Trusts and Agency', 'Debt Capital Markets', 'Derivatives', 'Distressed Investing and Debt Trading', 'Financial Services Regulation', 'Funds', 'Hedge Funds', 'Hybrid Securities', 'Islamic Finance', 'Portfolio Sales/Debt Trading', 'Prime Brokerage', 'Project Finance', 'Personal Property Securities Reform', 'Real Estate Finance', 'Regulatory', 'Securitisation', 'Structured products'],
        'Capital Markets': ['Capital Markets', 'Debt Capital Markets', 'Equity Capital Markets', 'Equity Linked and Hybrid Offerings', 'Securitisation', 'Structured Products', 'US Securities'],
        'Climate Change, Clean Energy and Environment': ['Clean Energy', 'Climate Change', 'Energy and Utilities', 'Environment', 'Infrastructure', 'Mining', 'Oil and Gas', 'Project Finance', 'Sustainability', 'Waste', 'Water'],
        'Commercial': ['General Commercial', 'Commercial Contracts', 'Sports Law', 'Wills and Estates'],
        'Competition/Antitrust': ['Access to Infrastructure', 'Advice and Compliance', 'Cartels', 'Competition and Regulation', 'Consumer Protection', 'Economic Expertise', 'Market Regulation', 'Merger Control and Joint Ventures ', 'Regulatory Investigations', 'Trade Practices'],
        'Corporate/M&A': ['Anti-Bribery and Corruption', 'Company Secretariat', 'Corporate Advisory', 'Corporate Governance', 'Financial Institutions', 'Financial Services', 'Foreign Investment', 'Funds', 'Hedge Funds', 'Mergers and Acquisitions', 'Merger Control', 'Outsourcing', 'Private Equity', 'US Securities'],
        'Employee Relations and Safety': ['Discrimination and Equal Opportunity', 'Employment', 'Industrial Relations', 'Major Incidents', 'Occupational Health and Safety', 'Remuneration, Benefits and Incentives', 'Workplace Training'],
        'Family Law': [],//Nothing
        'Government and Public': ['Administrative Law', 'Commissions of Enquiry', 'Federal Government', 'Inquiries and Coronial Inquests', 'Local Government', 'Planning', 'Probity Advice and Audits', 'Major Projects / PPPs', 'Royal Commissions', 'State Government', 'Transport'],
        'Human Rights': [],//Nothing
        'Immigration Law': [],//Nothing
        'Information Technology and Communications': ['Information Technology', 'Telecommunications', 'Media and Entertainment', 'Security Data Protection'],
        'Insurance and Reinsurance': [],//Nothing
        'Intellectual Property': ['Advertising', 'Brands and Marketing', 'Copyright and Design', 'Food Law', 'Freedom of Information', 'Life Sciences', 'Patents', 'Privacy', 'Trade Marks'],
        'Investment Management': ['Financial Services', 'Funds', 'Managed Investment Schemes'],
        'Litigation and Dispute Resolution': ['Advocacy', 'Arbitration', 'Banking, Regulatory and Finance Disputes', 'Class Actions', 'Commercial Disputes', 'Competition Disputes', 'Crisis Management and Investigations', 'Debt Recovery', 'Defamation', 'Disputes', 'Energy, Transport and Infrastructure Disputes', 'Financial Regulatory Disputes', 'Fraud and White Collar Criminal Law', 'International Compliance and Investigations', 'Licensing and Disciplinary Inquiries', 'Litigation', 'Mediation', 'Personal Injury', 'Product Liability', 'Prosecution and Enforcement', 'Real Estate Disputes', 'Technology Disputes '],
        'Real Estate and Construction': ['Acquisitions and Disposals', 'Construction Contracts', 'Construction Disputes', 'Conveyancing', 'Infrastructure', 'Property', 'Major Leasing', 'Major Projects / PPPs', 'Real Estate'],
        'Regulatory Other': ['Agriculture', 'Education', 'Financial Services', 'Healthcare', 'Native Title', 'Pharmaceutical'],
        'Restructuring and Insolvency': [],//Nothing
        'Taxation, Superannuation and Pensions': ['Tax and Revenue', 'Tax Litigation', 'Superannuation', 'Pensions'],
    })

    .constant('countries', [
        {
            Name: 'Australia',
            States: [
                {
                    Name: 'ACT',
                    Cities: [
                        'Canberra','Other'
                    ]
                },
                {
                    Name: 'NSW',
                    Cities: [
                        'Sydney',
                        'Newcastle', 'Other'
                    ]
                },
                {
                    Name: 'NT',
                    Cities: [
                        'Darwin', 'Other'
                    ]
                },
                {
                    Name: 'QLD',
                    Cities: [
                        'Brisbane',
                        'Townsville', 'Other'
                    ]
                },
                {
                    Name: 'SA',
                    Cities: [
                        'Adelaide', 'Other'
                    ]
                },
                {
                    Name: 'TAS',
                    Cities: [
                        'Hobart', 'Other'
                    ]
                },
                {
                    Name: 'VIC',
                    Cities: [
                        'Melbourne',
                        'Geelong', 'Other'
                    ]
                },
                {
                    Name: 'WA',
                    Cities: [
                        'Perth', 'Other'
                    ]
                }
            ],
            Cities: null
        },
        {
            Name: 'New Zealand',
            States: null,
            Cities: [
                'Auckland',
                'Wellington',
                'Other'
            ]
        }
    ]).constant('userRoles', {
            Client:'Client',
            Provider:'Provider',
            CompanyAdmin:'CompanyAdmin',
            BriefBoxAdmin:'BriefBoxAdmin',
            CanEditPanels:'CanEditPanels',
            CanPitch:'CanPitch'
        }
    )
;