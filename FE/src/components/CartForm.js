import React from 'react';
import propTypes from 'prop-types';
import '../styles/CartForm.scss';
import { useDispatch } from 'react-redux';
import CartListItem from './CartListItem';
import { CartDelete } from '../utils/cart';
import { cartToPayAction } from '../redux/actions/payAction';


const CartForm = ({ handleCart, handleCheckedCart }) => {
  const { cart, setAllCart } = handleCart;
  const { checkedItem, setCheckedItem } = handleCheckedCart;
  const dispatch = useDispatch();

  let totalPrice = 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(cartToPayAction({ ...checkedItem }));

    // 체크된 메뉴들 삭제
    for (let i = 0; i < checkedItem.length; i + 1) {
      CartDelete(cart, setAllCart, checkedItem[i].cartId, checkedItem, setCheckedItem);
    }

    // forEach문 쓰면 안된다 -> 하나씩 건너뛰면서 삭제함
    // checkedItemClone.forEach((element) => {
    //   console.log(element);
    // });
  };

  return (
    <div className="cartform-container">
      <div className="cartform-title">내역</div>
      <form action="submit" className="cartform" onSubmit={onSubmit}>
        <div className="cartform-list">
          {cart.map(item => (
            <CartListItem
              key={item.cartId}
              cartId={item.cartId}
              menuName={item.menuName}
              menuPrice={item.menuPrice}
              cart={cart}
              setAllCart={setAllCart}
              checkedItem={checkedItem}
              setCheckedItem={setCheckedItem}
            />
          ))}
        </div>

        <div className="cartform-total">
          <div>총결제액</div>
          <div className="cartform-total-price">
            {checkedItem.forEach((element) => {
              totalPrice += element.menuPrice;
            })}
            {`${totalPrice}`}
          </div>
        </div>
        <button type="submit" className="submit-button">
          결제하기
        </button>
      </form>
    </div>
  );
};

CartForm.propTypes = {
  handleCart: propTypes.shape({
    cart: propTypes.array.isRequired,
    setAllCart: propTypes.func.isRequired,
  }).isRequired,
  handleCheckedCart: propTypes.shape({
    checkedItem: propTypes.array.isRequired,
    setCheckedItem: propTypes.func.isRequired,
  }).isRequired,
};

export default CartForm;
