import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar to handle authentication cookies
const cookieJar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

// API Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    register: `${BASE_URL}/api/users/register`,
    login: `${BASE_URL}/api/users/login`,
    leads: `${BASE_URL}/api/leads`,
};

// Test user credentials
const TEST_USER = {
    email: 'test@gmail.com',
    password: 'Test@123',
    firstName: 'Test',
    lastName: 'User',
};

// Indian names data
const INDIAN_FIRST_NAMES = [
    // Male names
    'Arjun',
    'Vikram',
    'Rohit',
    'Amit',
    'Suresh',
    'Rajesh',
    'Anil',
    'Deepak',
    'Vinay',
    'Karan',
    'Ravi',
    'Sanjay',
    'Nitin',
    'Manoj',
    'Sachin',
    'Rahul',
    'Vishal',
    'Ashish',
    'Pradeep',
    'Ajay',
    'Ankit',
    'Gaurav',
    'Harsh',
    'Pavan',
    'Shivam',
    'Neeraj',
    'Tarun',
    'Yogesh',
    'Sandeep',
    'Akash',
    'Dev',
    'Jai',
    'Krishna',
    'Aryan',
    'Varun',
    'Abhishek',
    'Siddharth',
    'Manish',
    'Naveen',
    'Kartik',
    'Ramesh',
    'Mukesh',
    'Sunil',
    'Arun',
    'Vivek',
    'Mahesh',
    'Dinesh',
    'Jatin',
    'Nikhil',
    'Rohan',
    // Female names
    'Priya',
    'Anita',
    'Sunita',
    'Kavya',
    'Shreya',
    'Pooja',
    'Neha',
    'Riya',
    'Sonia',
    'Meera',
    'Deepika',
    'Aisha',
    'Nisha',
    'Rekha',
    'Geeta',
    'Maya',
    'Divya',
    'Ritu',
    'Swati',
    'Kiran',
    'Anjali',
    'Shweta',
    'Preeti',
    'Seema',
    'Madhuri',
    'Asha',
    'Usha',
    'Radha',
    'Lata',
    'Sita',
    'Aditi',
    'Sneha',
    'Tanvi',
    'Ishita',
    'Simran',
    'Pallavi',
    'Ruchi',
    'Vidya',
    'Nidhi',
    'Jyoti',
];

const INDIAN_LAST_NAMES = [
    'Sharma',
    'Gupta',
    'Singh',
    'Kumar',
    'Agarwal',
    'Verma',
    'Jain',
    'Patel',
    'Shah',
    'Mehta',
    'Reddy',
    'Rao',
    'Nair',
    'Pillai',
    'Iyer',
    'Krishnan',
    'Menon',
    'Bhat',
    'Shetty',
    'Kulkarni',
    'Desai',
    'Joshi',
    'Pandey',
    'Tiwari',
    'Mishra',
    'Srivastava',
    'Chandra',
    'Bansal',
    'Goyal',
    'Mittal',
    'Chopra',
    'Malhotra',
    'Kapoor',
    'Arora',
    'Batra',
    'Khanna',
    'Sethi',
    'Aggarwal',
    'Goel',
    'Saxena',
    'Bhatt',
    'Thakur',
    'Choudhary',
    'Sinha',
    'Dixit',
    'Tripathi',
    'Dubey',
    'Shukla',
    'Pathak',
    'Bajaj',
];

const INDIAN_CITIES = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Kalyan',
    'Vasai',
    'Varanasi',
    'Srinagar',
    'Aurangabad',
    'Dhanbad',
    'Amritsar',
    'Navi Mumbai',
    'Allahabad',
    'Ranchi',
    'Howrah',
    'Coimbatore',
    'Jabalpur',
    'Gwalior',
    'Vijayawada',
];

const INDIAN_STATES = [
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
    'West Bengal',
    'Madhya Pradesh',
    'Kerala',
    'Punjab',
    'Haryana',
    'Bihar',
    'Odisha',
    'Telangana',
    'Andhra Pradesh',
    'Jharkhand',
    'Assam',
    'Chhattisgarh',
    'Uttarakhand',
    'Himachal Pradesh',
];

const COMPANIES = [
    'Tech Solutions Pvt Ltd',
    'InfoSys Technologies',
    'Digital Innovations',
    'Smart Systems',
    'Future Tech Corp',
    'Global Solutions',
    'Advanced Analytics',
    'DataTech Services',
    'CloudFirst Technologies',
    'Enterprise Solutions',
    'NextGen Software',
    'Innovative Minds',
    'TechnoSoft India',
    'Digital Dynamics',
    'Smart Solutions Ltd',
    'Tech Ventures',
    'Innovation Hub',
    'Software Specialists',
    'Tech Pioneers',
    'Digital Leaders',
];

// Lead configuration
const LEAD_SOURCES = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'lost', 'won'];

class APITestDataGenerator {
    constructor() {
        this.loggedIn = false;
    }

    // Helper function to get random item from array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Helper function to get random number between min and max
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper function to make API requests
    async makeRequest(url, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies in requests
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetchWithCookies(url, options);
        return response;
    }

    // Register the test user
    async registerUser() {
        console.log('Registering test user...');
        try {
            const response = await this.makeRequest(API_ENDPOINTS.register, 'POST', TEST_USER);

            if (response.status === 201) {
                console.log('✅ Test user registered successfully!');
                return true;
            } else if (response.status === 400) {
                console.log('⚠️  User already exists, proceeding with login...');
                return true;
            } else {
                const errorText = await response.text();
                console.log(`❌ Registration failed: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Registration error: ${error.message}`);
            return false;
        }
    }

    // Login the test user and get access token
    async loginUser() {
        console.log('Logging in test user...');
        try {
            const loginData = {
                email: TEST_USER.email,
                password: TEST_USER.password,
            };

            const response = await this.makeRequest(API_ENDPOINTS.login, 'POST', loginData);

            if (response.status === 200) {
                const data = await response.json();

                // Check if cookies were set
                const cookies = cookieJar.getCookiesSync(BASE_URL);
                const accessTokenCookie = cookies.find((cookie) => cookie.key === 'accessToken');
                const refreshTokenCookie = cookies.find((cookie) => cookie.key === 'refreshToken');

                console.log('✅ Login successful!');
                console.log(`🍪 Access token cookie: ${accessTokenCookie ? 'Set' : 'Not found'}`);
                console.log(`🍪 Refresh token cookie: ${refreshTokenCookie ? 'Set' : 'Not found'}`);

                if (accessTokenCookie) {
                    this.loggedIn = true;
                    return true;
                } else {
                    console.log('❌ No authentication cookies received');
                    return false;
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ Login failed: ${response.status} - ${errorText}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Login error: ${error.message}`);
            return false;
        }
    }

    // Generate random lead data with Indian names
    createLeadData(index) {
        const firstName = this.getRandomItem(INDIAN_FIRST_NAMES);
        const lastName = this.getRandomItem(INDIAN_LAST_NAMES);

        // Create unique email
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;

        // Generate phone number (Indian format)
        const phone = `+91${this.getRandomNumber(7000000000, 9999999999)}`;

        const leadData = {
            firstName,
            lastName,
            email,
            phone,
            company: this.getRandomItem(COMPANIES),
            city: this.getRandomItem(INDIAN_CITIES),
            state: this.getRandomItem(INDIAN_STATES),
            source: this.getRandomItem(LEAD_SOURCES),
            status: this.getRandomItem(LEAD_STATUSES),
            score: this.getRandomNumber(0, 100),
            leadValue: parseFloat((Math.random() * 49000 + 1000).toFixed(2)),
            isQualified: Math.random() > 0.5,
        };

        return leadData;
    }

    // Create multiple leads
    async createLeads(count = 100) {
        console.log(`Creating ${count} leads...`);

        // Check if we're logged in
        if (!this.loggedIn) {
            console.log('❌ Not logged in! Cannot create leads.');
            return;
        }

        console.log(`🍪 Using authentication cookies for lead creation`);

        let createdLeads = 0;
        let failedLeads = 0;

        for (let i = 0; i < count; i++) {
            try {
                const leadData = this.createLeadData(i + 1);

                // Ensure distribution for first few leads
                if (i < LEAD_SOURCES.length) {
                    leadData.source = LEAD_SOURCES[i];
                }
                if (i < LEAD_STATUSES.length) {
                    leadData.status = LEAD_STATUSES[i];
                }

                const response = await this.makeRequest(API_ENDPOINTS.leads, 'POST', leadData);

                if (response.status === 201) {
                    createdLeads++;
                    if ((i + 1) % 10 === 0) {
                        console.log(`✅ Created ${i + 1} leads...`);
                    }
                } else {
                    failedLeads++;
                    const errorText = await response.text();
                    console.log(
                        `⚠️  Failed to create lead ${i + 1}: ${response.status} - ${errorText}`
                    );

                    // If it's still 401, show debug info for first failure
                    if (response.status === 401 && i === 0) {
                        const cookies = cookieJar.getCookiesSync(BASE_URL);
                        console.log(
                            `🔍 Debug - Current cookies:`,
                            cookies.map((c) => `${c.key}=${c.value.substring(0, 20)}...`)
                        );
                    }
                }

                // Add small delay to avoid overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 50));
            } catch (error) {
                failedLeads++;
                console.log(`❌ Error creating lead ${i + 1}: ${error.message}`);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`✅ Successfully created: ${createdLeads} leads`);
        console.log(`❌ Failed: ${failedLeads} leads`);
        console.log(`📈 Success rate: ${((createdLeads / count) * 100).toFixed(1)}%`);
    }

    // Run the complete data generation process
    async run() {
        console.log('🚀 Starting API Test Data Generation...');
        console.log('='.repeat(50));

        try {
            // Step 1: Register user
            const registered = await this.registerUser();
            if (!registered) {
                return false;
            }

            // Step 2: Login user
            const loggedIn = await this.loginUser();
            if (!loggedIn) {
                return false;
            }

            // Step 3: Create leads
            await this.createLeads(100);

            console.log('\n' + '='.repeat(50));
            console.log('🎉 Data generation completed!');
            console.log(`🔑 Test user email: ${TEST_USER.email}`);
            console.log(`🔒 Test user password: ${TEST_USER.password}`);

            return true;
        } catch (error) {
            console.log(`\n❌ Unexpected error: ${error.message}`);
            return false;
        }
    }
}

// Main function to run the data generator
async function main() {
    const generator = new APITestDataGenerator();

    try {
        await generator.run();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('\n⚠️  Process interrupted by user');
        } else {
            console.log(`\n❌ Unexpected error: ${error.message}`);
        }
    }
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log('\n⚠️  Process interrupted by user');
    process.exit(0);
});

// Run the main function
main().catch(console.error);
