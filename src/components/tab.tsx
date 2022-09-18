import React from 'react';
import { styled } from '@stitches/react';
import { mauve, green, blackA } from '@radix-ui/colors';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const StyledTabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '50vh',
  boxShadow: `0 2px 10px ${blackA.blackA4}`,
});

const StyledList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${mauve.mauve6}`,
});

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'white',
  padding: '0 20px',
  height: '45px !important',
  // flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  lineHeight: 1,
  color: blackA.blackA9,
  userSelect: 'none',
  '&:first-child': { borderTopLeftRadius: 6 },
  '&:last-child': { borderBottomLeftRadius: 6 },
  '&:hover': { color: blackA.blackA11 },
  '&[data-state="active"]': {
    color: blackA.blackA12,
    boxShadow: 'inset -1px 0 0 0 currentColor, 1px 0 0 0 currentColor',
  },
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px black` },
});

const StyledContent = styled(TabsPrimitive.Content, {
  // flexGrow: 1,
  width: '100%',
  // height: '100%',
  padding: 20,
  backgroundColor: 'white',
  borderTopRightRadius: 6,
  borderBottomRightRadius: 6,
  outline: 'none',
  '&:focus': { boxShadow: `0 0 0 2px black` },
});

// Exports
export const Tabs = StyledTabs;
export const TabsList = StyledList;
export const TabsTrigger = StyledTrigger;
export const TabsContent = StyledContent;

// Your app...
const Box = styled('div', {});
const Flex = styled('div', { display: 'flex' });

const Text = styled('div', {
  marginBottom: 20,
  color: mauve.mauve11,
  fontSize: 15,
  lineHeight: 1.5,
});

const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      violet: {
        backgroundColor: 'white',
        color: blackA.blackA11,
        boxShadow: `0 2px 10px ${blackA.blackA7}`,
        '&:hover': { backgroundColor: mauve.mauve3 },
        '&:focus': { boxShadow: `0 0 0 2px black` },
      },
      green: {
        backgroundColor: green.green4,
        color: green.green11,
        '&:hover': { backgroundColor: green.green5 },
        '&:focus': { boxShadow: `0 0 0 2px ${green.green7}` },
      },
    },
  },

  defaultVariants: {
    variant: 'violet',
  },
});
const Fieldset = styled('fieldset', {
  all: 'unset',
  marginBottom: 15,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
});

const Label = styled('label', {
  fontSize: 13,
  lineHeight: 1,
  marginBottom: 10,
  color: blackA.blackA12,
  display: 'block',
});

const Input = styled('input', {
  all: 'unset',
  flex: '1 0 auto',
  borderRadius: 4,
  padding: '0 10px',
  fontSize: 15,
  lineHeight: 1,
  color: blackA.blackA11,
  boxShadow: `0 0 0 1px ${blackA.blackA7}`,
  height: 35,
  '&:focus': { boxShadow: `0 0 0 2px ${blackA.blackA8}` },
});

const TabsDemo = () => (
  <Box css={{}}>
    <Tabs defaultValue="tab1" orientation="horizontal">
      <TabsList aria-label="Manage your account">
        <TabsTrigger value="tab1">Account</TabsTrigger>
        <TabsTrigger value="tab2">Password</TabsTrigger>
        <TabsTrigger value="tab3">Test</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Text>Make changes to your account here. Click save when you&apos;re done.</Text>
        <Fieldset>
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@peduarte" />
        </Fieldset>
        <Flex css={{ marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="green">Save changes</Button>
        </Flex>
      </TabsContent>
      <TabsContent value="tab2">
        <Text>Change your password here. After saving, you&apos;ll be logged out.</Text>
        <Fieldset>
          <Label htmlFor="currentPassword">Current password</Label>
          <Input id="currentPassword" type="password" />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" type="password" />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" />
        </Fieldset>
        <Flex css={{ marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="green">Change password</Button>
        </Flex>
      </TabsContent>
      <TabsContent value="tab3">
        <Text>Ok bro</Text>
      </TabsContent>
    </Tabs>
  </Box>
);

export default TabsDemo;
