import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB"

// Function to calculate percentage difference
const calculatePercentageDifference = (current: number, previous: number) => {
  if (previous === 0) {
    return { raw: current > 0 ? 100 : 0, formatted: current > 0 ? "+100%" : "0%" };
  }

  const difference = ((current - previous) / previous) * 100;
  return {
    raw: difference,
    formatted: `${difference > 0 ? "+" : ""}${difference.toFixed(2)}%`,
  };
};

export const getTotalSales = async () => {
  await connectToDB();

  const orders = await Order.find();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Calculate current and previous month
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // December if current month is January

  // Total orders and revenue for current month
  const currentMonthOrders = orders.filter(order => new Date(order.createdAt).getMonth() === currentMonth);
  const currentMonthSales = currentMonthOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Total orders and revenue for previous month
  const previousMonthOrders = orders.filter(order => new Date(order.createdAt).getMonth() === previousMonth);
  const previousMonthSales = previousMonthOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Calculate percentage difference for sales and orders
  const { raw: salesRawDifference, formatted: salesPercentageDifference } = calculatePercentageDifference(
    currentMonthSales,
    previousMonthSales
  );

  const { raw: ordersRawDifference, formatted: ordersPercentageDifference } = calculatePercentageDifference(
    currentMonthOrders.length,
    previousMonthOrders.length
  );

  return {
    totalOrders,
    totalRevenue,
    salesPercentageDifference, // Exporting the formatted sales trend
    salesRawDifference, // Raw difference for sales
    ordersPercentageDifference, // Exporting the formatted orders trend
    ordersRawDifference, // Raw difference for orders
  };
};

export const getTotalCustomers = async () => {
  await connectToDB();
  
  const customers = await Customer.find();
  const totalCustomers = customers.length;

  // Get customer count for current and previous month
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const currentMonthCustomers = customers
    .filter(customer => new Date(customer.createdAt).getMonth() === currentMonth)
    .length;

  const previousMonthCustomers = customers
    .filter(customer => new Date(customer.createdAt).getMonth() === previousMonth)
    .length;

  // Calculate percentage difference for customers
  const { raw: customerRawDifference, formatted: customerPercentageDifference } = calculatePercentageDifference(
    currentMonthCustomers,
    previousMonthCustomers
  );

  return {
    totalCustomers,
    customerRawDifference, // Exporting the raw difference if needed elsewhere
    customerPercentageDifference, // Exporting the customer trend
  };
};

export const getSalesPerMonth = async () => {
  await connectToDB()
  const orders = await Order.find()

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For October: acc[9] = (acc[9] || 0) + order.totalAmount (orders have monthIndex 9)
    return acc
  }, {})

  const graphData = Array.from({ length: 12}, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    // if i === 9 => month = "Oct"
    return { name: month, sales: salesPerMonth[i] || 0 }
  })

  return graphData
}
