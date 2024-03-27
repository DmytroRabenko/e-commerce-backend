// controllers/orderController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderController {
// Контролер для створення нового замовлення
createOrder = async (req, res) => {
  const { userId, products, totalPrice } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        products: { create: products },
        totalPrice
      }
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Could not create order' });
  }
};

// Контролер для отримання всіх замовлень користувача
getUserOrders = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: { products: true }
    });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Could not fetch user orders' });
  }
};

// Контролер для отримання інформації про конкретне замовлення
getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.orderId);

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by id:', error);
    res.status(500).json({ error: 'Could not fetch order' });
  }
};

// Контролер для видалення замовлення
deleteOrder = async (req, res) => {
  const orderId = parseInt(req.params.orderId);

  try {
    await prisma.order.delete({
      where: { id: orderId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Could not delete order' });
  }
};
}

module.exports = new OrderController();