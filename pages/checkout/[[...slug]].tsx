import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useCart } from '../../hooks/cart';
import { calcTotalPrice } from '../../lib/calculator';
import { useRouter } from 'next/navigation';
import MainLayout from '../../layouts/Main';
import { useAppDispatch } from '../../hooks/redux';
import { setCartTotal } from '../../redux/reducers/cart';
import { ICartItem } from 'boundless-api-client';
import { apiClient } from '../../lib/api';
import Swal from 'sweetalert2';
import { Loader } from 'lucide-react';


interface Totals {
  itemTotal: number;
  quantity: number;
  amountInPesewas: number;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface MainLayoutProps {
  mainMenu?: any;
  footerMenu?: any;
  basicSettings?: any;
}


const styles = {
  formContainer: `
    .form-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .form-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      color: #2d3748;
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .form-input:focus {
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
      outline: none;
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4299e1;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
    }

    .submit-button:hover {
      background-color: #3182ce;
    }

    .submit-button:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
    }

    .error-message {
      background-color: #fed7d7;
      border-left: 4px solid #f56565;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #c53030;
      border-radius: 0.25rem;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .grid-2 {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Loading Spinner Styles */
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner-text {
      color: #2d3748;
      font-weight: 500;
    }
  `,
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-container">
      <Loader className="animate-spin" size={48} />
      <p className="spinner-text">Processing your request...</p>
    </div>
  </div>
);
const useCartItems = () => {
  const dispatch = useAppDispatch();
  const { id: cartId } = useCart();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState(false);

	const initCartData = useCallback(async (cartId: string) => {
		setLoading(true);
		try {
			const { cart, items } = await apiClient.cart.getCartItems(cartId);
			setItems(items);

			const total = items.reduce((sum, item) => {
				const price = Number(calcTotalPrice(item.itemPrice.final_price!, item.qty)) || 0;
				return sum + price;
			}, 0);

			dispatch(setCartTotal({
				qty: items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
				total: total.toString() // Convert number to string
			}));
		} catch (err) {
			console.error('Failed to fetch cart items:', err);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

  useEffect(() => {
    if (cartId) {
      initCartData(cartId);
    }
  }, [cartId, initCartData]);

  return { items, setItems, loading };
};

const CheckoutPage: React.FC<MainLayoutProps> = ({ mainMenu = [], footerMenu = [], basicSettings = {} }) => {
  const router = useRouter();
  const { id: cartId } = useCart();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  const { items = [], loading: cartLoading } = useCartItems();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totals = useMemo<Totals>(() => {
    const itemTotal = items.reduce((sum, item) => {
      const price = Number(calcTotalPrice(item.itemPrice.final_price!, item.qty)) || 0;
      return sum + price;
    }, 0);

    return {
      itemTotal,
      quantity: items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0),
      amountInPesewas: Math.round(itemTotal * 100)
    };
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

	const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/verify?reference=${reference}`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  };

  const handlePaymentSuccess = async () => {
    await Swal.fire({
      title: 'Payment Successful!',
      text: 'Thank you for your purchase',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    router.push('/');
  };

  const handlePaymentFailure = async (error: any) => {
    await Swal.fire({
      title: 'Payment Failed',
      text: error.message || 'Failed to process payment',
      icon: 'error',
      confirmButtonColor: '#3085d6'
    });
    router.push('/checkout');
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          Volume: totals.itemTotal,
          Receiver: `${formData.firstName} ${formData.lastName}`,
          Package_Type: 'Shopping Cart',
          Reference: `order_${cartId}_${Date.now()}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      if (data.data?.authorization_url) {
        localStorage.setItem('paymentReference', data.data.reference);
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      await handlePaymentFailure(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference') || localStorage.getItem('paymentReference');

      if (reference) {
        localStorage.removeItem('paymentReference');
        const isSuccess = await verifyPayment(reference);

        if (isSuccess) {
          await handlePaymentSuccess();
          window.location.href = '/'; // Redirect to home page
        } else {
          await handlePaymentFailure(new Error('Payment verification failed'));
          window.location.href = '/checkout'; // Redirect back to checkout
        }
      }
    };

    if (isClient) {
      verifyPaymentStatus();
    }
  }, [isClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!items.length) {
      setError('Your cart is empty');
      return;
    }

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await initiatePayment();
  };

  if (!isClient) {
    return null;
  }

  if (cartLoading) {
    return (
      <MainLayout
        mainMenu={mainMenu}
        footerMenu={footerMenu}
        basicSettings={basicSettings}
        noIndex
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
    mainMenu={mainMenu}
    footerMenu={footerMenu}
    basicSettings={basicSettings}
    noIndex
  >
    <style dangerouslySetInnerHTML={{ __html: styles.formContainer }} />

    {(loading || cartLoading) && <LoadingSpinner />}

    <div className="min-h-screen bg-gray-50 py-12">
      <div className="form-container">
        <div className="form-header">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Processing...' : `Pay ${totals.itemTotal.toFixed(2)} GHS`}
          </button>
        </form>
      </div>
    </div>
  </MainLayout>
  );
};

export default CheckoutPage;