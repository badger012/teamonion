package com.teamonion.tmong.order;

import com.teamonion.tmong.member.MemberRepository;
import com.teamonion.tmong.menu.Menu;
import com.teamonion.tmong.menu.MenuRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OrdersService {

    @NonNull
    private final OrdersRepository ordersRepository;

    @NonNull
    private final MenuRepository menuRepository;

    @NonNull
    private final MemberRepository memberRepository;

    public void add(OrdersAddRequest ordersAddRequest) {
        // TODO : 총 금액 계산
        // TODO : 주문자 정보
        // TODO :
        // TODO :

        List<Long> menuIdList = ordersAddRequest.getMenuIdList();
        List<Menu> menuList = new ArrayList<>();

        Iterator iterator = menuIdList.iterator();
        while (iterator.hasNext()) {
            Optional<Menu> menu = menuRepository.findById((Long)iterator.next());
            menuList.add(menu.get());
        }

        //ordersRepository.save(ordersAddRequest.toEntity());
    }

}
