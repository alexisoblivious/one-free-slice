//Auth key: e3f200a2-ede2-486f-af33-db4a3b771f31

// Helper function to show a loading message on a specific element
function showLoadingMessage(message, elementId) {
  const loadingMessage = document.getElementById(elementId);
  loadingMessage.textContent = message;
}

// Helper function to remove the loading message on a specific element
function removeLoadingMessage(elementId) {
  const loadingMessage = document.getElementById(elementId);
  if (loadingMessage) {
    loadingMessage.textContent = '';
  }
}

// Helper function to show a success message on a specific element
function showOrderSuccessMessage(message, elementId) {
  const successMessage = document.getElementById(elementId);
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

// Helper function to show a success message on a specific element
function showSuccessMessage(message, elementId) {
  const successMessage = document.getElementById(elementId);
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

// Helper function to show an error message on a specific element
function showErrorMessage(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.color = '#eb8a90';
    element.textContent = message;
  }
}

// Helper function to create an order list item for Orders page
function createOrderListItem(order) {
  const listItem = document.createElement('li');
  listItem.textContent = `ID: ${order.id}, Style: ${order.style}, Crust: ${order.crust}, Extra Cheese: ${order.cheese}, Name: ${order.name}, Address: ${order.address}`;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    removeOrder(order.id);
  });

  listItem.appendChild(removeButton);
  return listItem;
}

async function fetchOrders() {
  try {
    showLoadingMessage('Loading orders...', 'ordersLoadingMessage');
    const response = await fetch('https://9cxlt1wgo5.execute-api.us-east-1.amazonaws.com/api/orders', {
      headers: {
        Authorization: 'basic e3f200a2-ede2-486f-af33-db4a3b771f31'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await response.json();
    const orderList = document.getElementById('orderList');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');

    // Clear previous orders
    orderList.innerHTML = '';
    orderSuccessMessage.textContent = ''; // Clear the content of the success message

    if (orders.length === 0) {
      const noOrdersMessage = document.createElement('p');
      noOrdersMessage.textContent = 'No orders available.';
      orderList.appendChild(noOrdersMessage);
    } else {
      // Append each order as a list item
      orders.forEach((order) => {
        const listItem = createOrderListItem(order);
        orderList.appendChild(listItem);
      });

      // Show the success message
      orderSuccessMessage.style.display = 'block';
    }
  } catch (error) {
    showErrorMessage(error.message, 'ordersErrorMessage');
  } finally {
    removeLoadingMessage('ordersLoadingMessage');
  }
}

window.addEventListener('DOMContentLoaded', fetchOrders);

const pizzaForm = document.getElementById('pizzaForm');
if (pizzaForm) {
  pizzaForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const errorMessageParagraph = document.getElementById('errorMessage');
  if (errorMessageParagraph) {
    errorMessageParagraph.textContent = '';
  }

  const style = pizzaForm.elements.style.value;
  const crust = pizzaForm.elements.crust.value;
  const extraCheese = pizzaForm.elements.extraCheese.checked;
  const name = pizzaForm.elements.name.value;
  const address = pizzaForm.elements.address.value;

  let errorMessage = '';

  if (!style) {
    errorMessage += 'Please select a style. ';
  }

  if (!crust) {
    errorMessage += 'Please select a crust. ';
  }

  if (!name) {
    errorMessage += 'Please enter your name. ';
  }

  if (!address) {
    errorMessage += 'Please enter your address. ';
  }

  if (errorMessage) {
    showErrorMessage(errorMessage, 'errorMessage');
    return;
  }

  showLoadingMessage('Processing your order...', 'getPizzaLoadingMessage');

  const order = {
    id: Math.floor(Math.random() * 1000),
    style,
    crust,
    cheese: extraCheese,
    name,
    address
  };

  try {
    const response = await fetch('https://9cxlt1wgo5.execute-api.us-east-1.amazonaws.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'basic e3f200a2-ede2-486f-af33-db4a3b771f31'
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error('Failed to add order');
    }

    showSuccessMessage('Your order has been submitted!', 'getPizzaSuccessMessage');
    pizzaForm.reset();
    pizzaForm.classList.add('hidden');
  } catch (error) {
    showErrorMessage('There was an issue processing your order. Please try again.', 'errorMessage');
  } finally {
    removeLoadingMessage('getPizzaLoadingMessage');
  }
}

async function removeOrder(orderId) {
  try {
    showLoadingMessage('Removing order...', 'ordersLoadingMessage');

    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    
    if (orderSuccessMessage) {
      orderSuccessMessage.textContent = ''; // Clear the success message content
    }

    const response = await fetch(`https://9cxlt1wgo5.execute-api.us-east-1.amazonaws.com/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'basic e3f200a2-ede2-486f-af33-db4a3b771f31'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove order');
    }

    // Fetch and display the updated orders after successful removal
    fetchOrders();

    // Show the success message with its background after successful removal
    if (orderSuccessMessage) {
      orderSuccessMessage.textContent = 'Order removed successfully';
      orderSuccessMessage.style.display = 'block';
    }
  } catch (error) {
    showErrorMessage(error.message, 'ordersErrorMessage');
  } finally {
    removeLoadingMessage('ordersLoadingMessage');
  }
}