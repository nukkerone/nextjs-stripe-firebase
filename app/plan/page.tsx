'use client';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Box,
  Flex,
  Button,
} from '@chakra-ui/react';

export default function () {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Card
        width={{ base: 'calc(100% - 32px)' }}
        maxW={{ base: '400px' }}
        boxShadow="xl"
      >
        <CardHeader>
          <Text fontWeight="bold" textAlign="center" textTransform="uppercase">
            Base Plan
          </Text>
        </CardHeader>
        <CardBody>
          <Box mb="5">
            <hr />
          </Box>
          <Text textAlign="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
            facilisis nisi.
          </Text>
          <Text
            fontWeight="bold"
            fontSize="3xl"
            textAlign="center"
            mt="5"
            mb="0"
          >
            5000k Tokens
          </Text>
          <Text fontStyle="italic" fontSize="sm" textAlign="center" mb="5">
            * Per month
          </Text>
          <Text textAlign="center">
            Nulla sit amet lectus justo. Ut aliquam ipsum dui, ac ornare elit
            fermentum non. Cras sed metus at sapien porttitor egestas sit amet
            ullamcorper erat.
          </Text>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button colorScheme="teal" size="lg">
            Select
          </Button>
        </CardFooter>
      </Card>
    </Flex>
  );
}
