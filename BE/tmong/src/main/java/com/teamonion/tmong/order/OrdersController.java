package com.teamonion.tmong.order;

import com.teamonion.tmong.member.MemberRole;
import com.teamonion.tmong.authorization.CheckJwt;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/orders")
@RestController
public class OrdersController {

    @NonNull
    private final OrdersService ordersService;

    @NonNull
    private final SimpMessagingTemplate simpMessagingTemplate;

    @CheckJwt
    @PostMapping
    public ResponseEntity<Long> makeOrder(@RequestBody @Valid OrdersAddRequest ordersAddRequest) {
        OrdersResponse ordersResponse = ordersService.makeOrder(ordersAddRequest);

        simpMessagingTemplate.convertAndSend("/topic/orders/add", ordersResponse);
        return new ResponseEntity<>(ordersResponse.getId(), HttpStatus.CREATED);
    }

    @CheckJwt
    @GetMapping("/my")
    public ResponseEntity<Page<OrdersResponse>> getMyOrders(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) Pageable pageable, boolean pickup) {
        return new ResponseEntity<>(ordersService.getMyOrders(pageable, pickup), HttpStatus.OK);
    }

    @CheckJwt(role = MemberRole.ADMIN)
    @GetMapping
    public ResponseEntity<Page<OrdersResponse>> getOrdersByCategory(
            @PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC) Pageable pageable, OrdersCategory category) {
        return new ResponseEntity<>(ordersService.getOrdersByCategory(pageable, category), HttpStatus.OK);
    }
}
