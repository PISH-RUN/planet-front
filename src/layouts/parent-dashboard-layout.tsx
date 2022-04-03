import { useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, ListItemIcon, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import LogoImage from "../public/images/logo.png";
import DashboardIcon from "layouts/icons/dashboard";
import BaseLayout from "./baseLayout";
import CalendarIcon from "layouts/icons/calendar";
import TelescopeIcon from "layouts/icons/telescope";
import GiftIcon from "layouts/icons/gift";
import BulbIcon from "layouts/icons/bulb";
import ChatBubbleIcon from "layouts/icons/chatBubble";
import SettingIcon from "layouts/icons/setting";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowDown from "./icons/arrow-down";
import { useApp } from "@kidneed/hooks";
import { Models } from "@kidneed/types";
import { DateRange, LocalizationProvider, StaticDateRangePicker } from "@mui/lab";
import JalaliUtils from "@date-io/jalaali";
import jMoment from "moment-jalaali";
import { FaPlus } from "react-icons/fa";

jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

export type ParentDashboardLayoutProps = {
  children: React.ReactNode;
  showChild?: boolean;
  showRange?: boolean;
  onRangeChange?: (range: DateRange<Date>) => void;
  SideComponent?: React.ReactNode;
};

const today: DateRange<Date> = [new Date(), new Date()];

const DATE_SIZE = 28;

const styles = {
  navButton: {
    px: 4,
    py: 3,
    borderRadius: 3,
    width: "100%",
    fontSize: 20,
    justifyContent: "left",
    "& svg": {
      fontSize: "28px!important",
      mr: 1
    },
    color: "#8CA3A5"
  },
  activeNavButton: {
    color: "#fff"
  }
};

const menu = [
  {
    title: "داشبورد",
    link: "/parent/dashboard",
    icon: <DashboardIcon />
  }, {
    title: "از همه رنگ",
    link: "/parent/dayPlan",
    icon: <CalendarIcon />
  }, {
    title: "کارنما",
    link: "/parent/dashboard2",
    icon: <TelescopeIcon />
  }, {
    title: "بچه زرنگ",
    link: "/parent/dashboard3",
    icon: <GiftIcon />
  }, {
    title: "راه چه",
    link: "/earth",
    icon: <BulbIcon />
  }, {
    title: "پیام ها",
    link: "/parent/dashboard5",
    icon: <ChatBubbleIcon />
  }, {
    title: "تنظیمات",
    link: "/parent/dashboard6",
    icon: <SettingIcon />
  }
];

const NavBar = () => {
  const { pathname, ...router } = useRouter();

  // @ts-ignore
  const isSelectedMenu = (link) => {
    return (pathname.indexOf(link) !== -1);
  };

  const handleClickMenu = (link: string) => router.push(link);

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2
      }}
    >
      <Box sx={{ maxWidth: 210, p: 2, margin: "0 auto" }}><Image src={LogoImage} alt="logo" /></Box>
      <Box sx={{ mt: 5 }}>
        {/*@ts-ignore*/}
        {menu.map((m, index) =>
          <Link key={index} href={m.link}>
            <Button
              sx={{ ...styles.navButton, ...(isSelectedMenu(m.link) ? styles.activeNavButton : {}) }}
              variant={isSelectedMenu(m.link) ? "contained" : "text"}
              startIcon={m.icon}
            >{m.title}</Button>
          </Link>)}
      </Box>
    </Box>
  );
};

export default function ParentDashboardLayout(props: ParentDashboardLayoutProps) {
  const { children, SideComponent, showChild, showRange, onRangeChange } = props;
  const [range, setRange] = useState<DateRange<Date>>(today);
  const [anchorEl, setAnchorEl] = useState(null);
  const { ctx, selectChild } = useApp();
  const router = useRouter();

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectChild = (child: Models.Child) => {
    selectChild(child);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log(range);
    if (range[0] !== null && range[1] !== null) {
      onRangeChange && onRangeChange(range);
    }
  }, [range]);

  return <BaseLayout>
    <Grid container spacing={0}>
      <Grid item sx={{ width: 300 }}>
        <NavBar />
      </Grid>
      <Grid item xs>
        <Box sx={{ borderRadius: 8, p: 2, mt: 2, background: "#F5F9F8", minHeight: "90vh" }}>
          {children}
        </Box>
      </Grid>
      {(showChild || !!SideComponent) &&
        <Grid item sx={{ width: { xl: 300, xs: 250 } }}>
          {showChild &&
            <Stack
              onClick={handleOpen}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ py: 2, px: 2, cursor: "pointer" }}
            >
              <Avatar
                sx={{ width: 80, height: 80, p: 2, background: "#E2F1FD" }}
                src="/images/avatar-woman.png"
              />
              <Box flexGrow={1}>
                {ctx.child &&
                  <span className="tw-text-xl tw-font-bold">{ctx.child.gender === "boy" ? `آقا ${ctx.child.name}` : `${ctx.child.name} خانوم`}</span>
                }
              </Box>
              <Box>
                <ArrowDown sx={{ color: "#8CA3A5", fontSize: 16 }} />
              </Box>
            </Stack>
          }
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button"
            }}
            PaperProps={{
              sx: {
                minWidth: 280
              }
            }}
          >
            {ctx.children?.map(c => (
              <MenuItem
                key={c.id}
                selected={ctx.child?.id === c.id}
                onClick={() => handleSelectChild(c)}
              >{c.name}</MenuItem>
            ))}
            <MenuItem
              onClick={() => router.push("/add-child")}
            >
              <ListItemIcon>
                <FaPlus />
              </ListItemIcon>
              افزودن فرزند
            </MenuItem>
          </Menu>
          {showRange &&
            <Box
              sx={{
                "& > div": {
                  minWidth: 250
                },
                "& > div > div, & > div > div > div, & .MuiCalendarPicker-root": {
                  width: 250
                },
                "& .MuiTypography-caption": {
                  width: 32,
                  margin: 0
                },
                "& .PrivatePickersSlideTransition-root": {
                  minHeight: DATE_SIZE * 7,
                  minWidth: 250
                },
                "& .PrivatePickersSlideTransition-root [role=\"row\"]": {
                  margin: 0
                },
                "& .MuiPickersDay-dayWithMargin": {
                  margin: 0
                },
                "& .MuiPickersDay-root": {
                  width: DATE_SIZE,
                  height: DATE_SIZE
                },
                "& .MuiDateRangePickerDay-rangeIntervalDayHighlight + .MuiDateRangePickerDay-rangeIntervalDayHighlightEnd": {
                  background: "#aed6fa"
                }
              }}
            >
              <LocalizationProvider dateAdapter={JalaliUtils}>
                <StaticDateRangePicker
                  showToolbar={false}
                  value={range}
                  onChange={(value) => {
                    if (value[0] === null || value[1] === null) {
                      setRange(value);
                    } else if (range[0] === null || range[1] === null) {
                      setRange(value);
                    } else if (range[0] !== null && range[1] !== null && value[0] !== null && value[1] !== null) {
                      setRange([value[0], null]);
                    }
                  }}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </LocalizationProvider>
            </Box>
          }
          {SideComponent}
        </Grid>
      }
    </Grid>
  </BaseLayout>;
}
