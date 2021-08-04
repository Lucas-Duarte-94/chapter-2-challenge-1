import { useState } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
     // TODO
    product : {...product, formattedPrice:formatPrice(product.price), subTotal:formatPrice(product.price * product.amount)}
  }))
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
         sumTotal += product.amount * product.price

         return sumTotal;
      }, 0)
     )

  function handleProductIncrement(product: Product) {
    // TODO
    const prod = {productId:product.id , amount:product.amount + 1}
    updateProductAmount(prod)
  }

  function handleProductDecrement(product: Product) {
    // TODO
    const prod = {productId:product.id , amount:product.amount - 1}
    updateProductAmount(prod)
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>

        {cartFormatted.map(formatted=> {
          return <tbody key={formatted.product.id}>
                  <tr data-testid="product">
                    <td>
                      <img src={formatted.product.image} alt={formatted.product.title} />
                    </td>
                    <td>
                      <strong>{formatted.product.title}</strong>
                      <span>{formatted.product.formattedPrice}</span>
                    </td>
                    <td>
                      <div>
                        <button
                          type="button"
                          data-testid="decrement-product"
                          disabled={formatted.product.amount <= 1}
                          onClick={() => handleProductDecrement(formatted.product)}
                        >
                          <MdRemoveCircleOutline size={20} />
                        </button>
                        <input
                          type="text"
                          data-testid="product-amount"
                          readOnly
                          value={formatted.product.amount}
                        />
                        <button
                          type="button"
                          data-testid="increment-product"
                          onClick={() => handleProductIncrement(formatted.product)}
                        >
                          <MdAddCircleOutline size={20} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{formatted.product.subTotal}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        data-testid="remove-product"
                        onClick={() => handleRemoveProduct(formatted.product.id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                </tbody>


        })
          
        }

        
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
