package com.teamonion.tmong.menu;

import com.teamonion.tmong.security.JwtComponent;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class MenuServiceTest {

    @Mock
    MenuRepository menuRepository;

    @Mock
    JwtComponent jwtComponent;

    @Mock
    ImageFileService imageFileService;

    @InjectMocks
    MenuService menuService;

    private Menu menu;
    private MenuSaveDto menuSaveDto;
    private MenuUpdateDto menuUpdateDto;

    @Before
    public void setUp() throws IOException {
        menuSaveDto = new MenuSaveDto();
        menuUpdateDto =  new MenuUpdateDto();

        MultipartFile mockMultipartFile = new MockMultipartFile("test", "test", "image/jpg"
                , new FileInputStream(new File("src/main/resources/menuImage/example/example.jpg")));

        menuSaveDto.setImageFile(mockMultipartFile);

        menu = new Menu();
        menu.update(1L);
    }

    @Test
    public void 메뉴추가테스트() {
        menu = menuSaveDto.toEntity("test");

        Mockito.when(menuRepository.save(menu)).thenReturn(menu);

        assertThat(menuService.add(menuSaveDto)).isEqualTo(menu.getId());
    }

    @Test
    public void 메뉴수정테스트() {
        Long id = 1L;
        // TODO : 이미지 경로
        Mockito.when(menuRepository.findById(id)).thenReturn(Optional.of(menu));

        menuService.updateMenu(id, menuUpdateDto);
    }

    @Test
    public void 메뉴삭제테스트() {
        Long id = 1L;

        Mockito.when(menuRepository.findById(id)).thenReturn(Optional.of(menu));

        menuService.deleteByMenuId(id);
    }

}