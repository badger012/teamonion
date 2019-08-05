package com.teamonion.tmong.order;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamonion.tmong.menu.Menu;
import com.teamonion.tmong.security.JwtComponent;
import org.hibernate.criterion.Order;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(OrdersController.class)
public class OrdersControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    SimpMessagingTemplate simpMessagingTemplate;

    @MockBean
    OrdersService ordersService;

    @MockBean
    JwtComponent jwtComponent;

    @Test
    public void makeOrder() throws Exception {
        OrdersAddRequest ordersAddRequest = new OrdersAddRequest();
        ordersAddRequest.setMenuIdList(Arrays.asList(1L, 2L));
        ordersAddRequest.setPaymentType(PaymentType.POINT);
        ordersAddRequest.setPaid(true);

//        mockMvc.perform(post("/api/orders")
//                .contentType(MediaType.APPLICATION_JSON_UTF8)
//                .content(objectMapper.writeValueAsString(ordersAddRequest))
//                .accept(MediaType.APPLICATION_JSON_UTF8)
//                .header("Authorization", "Bearer " + jwtComponent))
//                .andDo(print())
//                .andExpect(status().isCreated());
    }

    @Test
    public void getOrdersByCategory() throws Exception {
        mockMvc.perform(get("/api/orders")
                .param("category", "ALL")
                .header("Authorization", "Bearer " + jwtComponent))
                .andDo(print())
                .andExpect(status().isOk());
    }
}