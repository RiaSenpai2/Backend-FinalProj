const mongoose = require('mongoose');
const Listing = require('./models/Listing'); // Replace with the path to your Listing model
const User = require('./models/User'); // Replace with the path to your User model

mongoose.connect('mongodb://localhost:27017/finalProjDb', { useNewUrlParser: true, useUnifiedTopology: true });

// Function to generate dates
const generateDate = (startDay) => {
    let date = new Date(2023, 11, startDay); // December (11) of 2023
    return date;
};

// Sample listings data
const listingsData = [
    { name: 'John Doe', email: 'john@example.com', departureCity: 'New York', destination: 'London', flightNum: 'AB123', date: generateDate(9), time: '08:00', availableSpace: '20kg', askingPrice: '100', additionalInfo: 'No liquids' },
    { name: 'Alice Smith', email: 'alice@example.com', departureCity: 'Los Angeles', destination: 'Tokyo', flightNum: 'LA456', date: generateDate(10), time: '09:00', availableSpace: '15kg', askingPrice: '120', additionalInfo: 'Fragile' },
    { name: 'Bob Johnson', email: 'bob@example.com', departureCity: 'Chicago', destination: 'Paris', flightNum: 'CJ789', date: generateDate(11), time: '10:00', availableSpace: '10kg', askingPrice: '80', additionalInfo: 'Handle with care' },
    { name: 'Emma Wilson', email: 'emma@example.com', departureCity: 'San Francisco', destination: 'Berlin', flightNum: 'SF101', date: generateDate(12), time: '11:00', availableSpace: '18kg', askingPrice: '150', additionalInfo: 'No food items' },
    { name: 'Michael Brown', email: 'michael@example.com', departureCity: 'Miami', destination: 'Amsterdam', flightNum: 'MB202', date: generateDate(13), time: '12:00', availableSpace: '25kg', askingPrice: '90', additionalInfo: 'Weather sensitive' },
    { name: 'Sophia Davis', email: 'sophia@example.com', departureCity: 'Seattle', destination: 'Dubai', flightNum: 'SD303', date: generateDate(14), time: '13:00', availableSpace: '30kg', askingPrice: '110', additionalInfo: 'Extra care required' },
    { name: 'Olivia Martinez', email: 'olivia@example.com', departureCity: 'Dallas', destination: 'Rome', flightNum: 'OM404', date: generateDate(9), time: '14:00', availableSpace: '20kg', askingPrice: '95', additionalInfo: 'No perishables' },
    { name: 'Liam Garcia', email: 'liam@example.com', departureCity: 'Boston', destination: 'Cairo', flightNum: 'LG505', date: generateDate(9), time: '15:00', availableSpace: '18kg', askingPrice: '105', additionalInfo: 'Fragile' },
    { name: 'Noah Rodriguez', email: 'noah@example.com', departureCity: 'Houston', destination: 'Moscow', flightNum: 'NR606', date: generateDate(9), time: '16:00', availableSpace: '22kg', askingPrice: '100', additionalInfo: 'No electronics' },
    { name: 'Emma Davis', email: 'emma_d@example.com', departureCity: 'Phoenix', destination: 'Mumbai', flightNum: 'ED707', date: generateDate(9), time: '17:00', availableSpace: '15kg', askingPrice: '120', additionalInfo: 'Handle with care' },
    { name: 'Ava Lopez', email: 'ava@example.com', departureCity: 'Philadelphia', destination: 'Sydney', flightNum: 'AL808', date: generateDate(9), time: '18:00', availableSpace: '25kg', askingPrice: '130', additionalInfo: 'Weather sensitive' },
    { name: 'William Johnson', email: 'william@example.com', departureCity: 'San Antonio', destination: 'São Paulo', flightNum: 'WJ909', date: generateDate(9), time: '19:00', availableSpace: '20kg', askingPrice: '85', additionalInfo: 'Extra care required' },
    { name: 'James Brown', email: 'james@example.com', departureCity: 'San Diego', destination: 'Beijing', flightNum: 'JB010', date: generateDate(9), time: '20:00', availableSpace: '30kg', askingPrice: '140', additionalInfo: 'No liquids' },
    { name: 'Ethan Wilson', email: 'ethan@example.com', departureCity: 'New York', destination: 'London', flightNum: 'EW111', date: generateDate(9), time: '08:30', availableSpace: '25kg', askingPrice: '105', additionalInfo: 'No perishables' },
    { name: 'Ava Taylor', email: 'ava@example.com', departureCity: 'New York', destination: 'London', flightNum: 'AT222', date: generateDate(9), time: '09:00', availableSpace: '30kg', askingPrice: '110', additionalInfo: 'Fragile items only' },
    { name: 'Liam Johnson', email: 'liam@example.com', departureCity: 'New York', destination: 'London', flightNum: 'LJ333', date: generateDate(9), time: '09:30', availableSpace: '10kg', askingPrice: '100', additionalInfo: 'Handle with care' },
    { name: 'Sophia Brown', email: 'sophia@example.com', departureCity: 'New York', destination: 'London', flightNum: 'SB444', date: generateDate(9), time: '10:00', availableSpace: '20kg', askingPrice: '115', additionalInfo: 'No electronics' },
    { name: 'Noah Davis', email: 'noah@example.com', departureCity: 'New York', destination: 'London', flightNum: 'ND555', date: generateDate(9), time: '10:30', availableSpace: '15kg', askingPrice: '120', additionalInfo: 'Weather sensitive' },
    { name: 'Mia Garcia', email: 'mia@example.com', departureCity: 'New York', destination: 'London', flightNum: 'MG666', date: generateDate(9), time: '11:00', availableSpace: '10kg', askingPrice: '105', additionalInfo: 'Extra care required' },
    { name: 'Oliver Martinez', email: 'oliver@example.com', departureCity: 'New York', destination: 'London', flightNum: 'OM777', date: generateDate(9), time: '11:30', availableSpace: '25kg', askingPrice: '110', additionalInfo: 'No liquids or gels' }
];

// Sample users data
const usersData = [
    { fname: 'Ria', lname: 'Tyagi', email: 'riatyagi@gmail.com', password: 'Ria@$2b$10$3k22GWocrXL/Xverws4VjO9hkkATyAs.liNKZtHFqafOtfwIluHxu123@tyagi', userType: 'registered' },
    { fname: 'Jane', lname: 'Doe', email: 'jane@example.com', password: 'password123', userType: 'regular' }
];

const seedDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});

    await Listing.insertMany(listingsData);
    await User.insertMany(usersData);
};

seedDB().then(() => {
    console.log('Database seeded!');
    mongoose.connection.close();
});
