import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Accordion } from "@ark-ui/react";
import { getCoinbasePrices } from "../utils/coinbase";
import AppTooltip from "./shared/Tooltip";
import InfoIcon from "../assets/images/Info.svg";
import Arrow from "../assets/images/ArraowDown.svg";
import {
  getChainDetails,
  getLogo,
  isMaxAllowance,
} from "../utils/commonFunction";
import { symbolToLogo } from "../utils/getLogoFromSymbol";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  gap: 1rem;
`;

const AccordionWrapper = styled(Accordion.Item)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ItemIndicator = styled(Accordion.ItemIndicator)`
  height: 15px;
  width: 15px;
  margin-top: 2px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TooltipMessage = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const TotalFees = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const TotalAtDestination = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryTitleColor};
`;

const TotalFeesValue = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const TotalAtDestinationValue = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryTitleColor};
`;

// const USDValue = styled.span`
//   font-family: "Inter", sans-serif;
//   font-size: 0.75rem;
//   font-weight: 500;
//   color: ${({ theme }) => theme.primaryTitleColor};
// `;

const ViewBreakupButton = styled(Accordion.ItemTrigger)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.secondaryColor};
  border: none;
  background: transparent;
  cursor: pointer;
`;

const AccordionContent = styled(Accordion.ItemContent)`
  padding-top: 0.75rem;
`;

const FeeDetails = styled.div`
  background: ${({ theme }) => theme.cardDetailsBackGround};
  border: ${({ theme }) => `1px solid ${theme.backgroundColor}`};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const Value = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.secondaryTitleColor};
`;

const ChainDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Chain = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.cardBackGround};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* Space between items */
`;

const RelativeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Logo = styled.img`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: #ffffff;
`;

const DestinationChainLogo = styled.img`
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #ffffff;
`;

const ChainLogo = styled.img`
  position: absolute;
  bottom: -4px;
  right: -4px;
  z-index: 50;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  border: 1px solid #ffffff;
`;

const TokenDetails = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const InfoImg = styled.img`
  filter: ${({ theme }) => theme.infoImg};
`;

const TokenName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.primaryColor};
`;

const AllowanceAmount = styled.div`
  text-align: right;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  margin-top: 20px;
  padding: 15px 20px;
  width: 100%;
  background: ${({ theme, variant }) =>
    variant === "secondary" ? `transparent` : theme.primaryColor};
  color: ${({ theme, variant }) =>
    variant === "secondary" ? theme.primaryColor : theme.buttonTextColor};
  border: ${({ theme }) => `2px solid ${theme.primaryColor}`};
  border-radius: 25px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.3s ease;
  text-transform: uppercase;
  &:hover {
    background: ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.buttonTextColor};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

type ReadableIntent = {
  sourcesTotal: string;
  destination: {
    chainID: number;
    chainLogo: string | undefined;
    amount: string;
    chainName: string;
  };
  sources: {
    chainID: number;
    chainLogo: string | undefined;
    chainName: string;
    amount: string;
    contractAddress: `0x${string}`;
  }[];
  fees: {
    gasSupplied: string;
    protocol: string;
    caGas: string;
    solver: string;
    total: string;
  };
  token: {
    symbol: string;
    decimals: number;
    name: string;
    logo: string | undefined;
  };
};

interface FeesBreakdownProps {
  intent: ReadableIntent;
  deny: () => void;
  allow: () => void;
  intentRefreshing: boolean;
}

const FeesBreakdown: React.FC<FeesBreakdownProps> = ({
  allow,
  deny,
  intent,
  intentRefreshing,
}) => {
  const [rates, setRates] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getCoinbasePrices();
      setRates(fetchedRates);
    };

    fetchRates();

    const interval = setInterval(() => {
      fetchRates();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <Content>
        <Title>Destination</Title>
        <ChainDetails>
          <DestinationChainLogo
            src={intent.destination.chainLogo}
            alt="Chain Logo"
          />
          <Chain>Arbitrum</Chain>
        </ChainDetails>
      </Content>
      <Accordion.Root multiple collapsible>
        <AccordionWrapper key={1} value="fee-breakup">
          <Header>
            <HeaderLeft>
              <TooltipMessage>Spend</TooltipMessage>
              <AppTooltip message="Total Fees">
                <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
              </AppTooltip>
            </HeaderLeft>
            <HeaderRight>
              <TotalFees>
                {Number(intent?.sourcesTotal)?.toFixed(6) || "0"}{" "}
                {intent?.token?.symbol}
              </TotalFees>
              {rates?.[intent?.token?.symbol] && (
                <TotalAtDestination>
                  ~
                  {(
                    Number(intent?.fees?.total) /
                    Number(rates[intent?.token?.symbol])
                  ).toFixed(2)}{" "}
                  USD
                </TotalAtDestination>
              )}
              <ViewBreakupButton>
                <span>View Sources</span>
                <ItemIndicator>
                  <img src={Arrow} alt="Arrow" height={12} width={12} />
                </ItemIndicator>
              </ViewBreakupButton>
            </HeaderRight>
          </Header>
          <AccordionContent>
            <FeeDetails>
              {intent.sources.map((allowance) => (
                <Card key={allowance.chainID}>
                  <FlexContainer>
                    <RelativeContainer>
                      <Logo src={intent.token.logo} alt="Token Logo" />
                      <ChainLogo src={allowance.chainLogo} alt="Chain Logo" />
                    </RelativeContainer>
                    <TokenDetails>
                      <TokenName>{allowance.chainName}</TokenName>
                    </TokenDetails>
                  </FlexContainer>
                  <AllowanceAmount>
                    {isMaxAllowance(allowance.amount)
                      ? "Unlimited"
                      : allowance.amount}{" "}
                    {allowance.chainName}
                  </AllowanceAmount>
                </Card>
              ))}
            </FeeDetails>
          </AccordionContent>
        </AccordionWrapper>
      </Accordion.Root>
      <Accordion.Root multiple collapsible>
        <AccordionWrapper value="fee-breakup">
          <Header>
            <HeaderLeft>
              <TooltipMessage>Total Fees</TooltipMessage>
              <AppTooltip message="Total Fees">
                <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
              </AppTooltip>
            </HeaderLeft>
            <HeaderRight>
              <TotalFees>
                {Number(intent?.fees?.total)?.toFixed(6) || "0"}{" "}
                {intent?.token?.symbol}
              </TotalFees>
              {rates?.[intent?.token?.symbol] && (
                <TotalAtDestination>
                  ~
                  {(
                    Number(intent?.fees?.total) /
                    Number(rates[intent?.token?.symbol])
                  ).toFixed(2)}{" "}
                  USD
                </TotalAtDestination>
              )}
              <ViewBreakupButton>
                <span>View Breakup</span>
                <ItemIndicator>
                  <img src={Arrow} alt="Arrow" height={12} width={12} />
                </ItemIndicator>
              </ViewBreakupButton>
            </HeaderRight>
          </Header>
          <AccordionContent>
            <FeeDetails>
              <FeeRow>
                <HeaderLeft>
                  <Label>CA Gas Fees: </Label>
                  <AppTooltip message="Total Fees">
                    <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
                  </AppTooltip>
                </HeaderLeft>
                <HeaderRight>
                  <Value>
                    {Number(intent?.fees?.caGas)?.toFixed(6) || "0"}{" "}
                    {intent?.token?.symbol}
                  </Value>
                  {/* {rates?.[intent?.token?.symbol] && (
                    <USDValue>
                      ~
                      {(
                        Number(intent?.sourcesTotal) /
                        Number(rates[intent?.token?.symbol])
                      ).toFixed(2)}{" "}
                      USD
                    </USDValue>
                  )} */}
                </HeaderRight>
              </FeeRow>
              <FeeRow>
                <HeaderLeft>
                  <Label>Solver Fees:</Label>
                  <AppTooltip message="Total Fees">
                    <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
                  </AppTooltip>
                </HeaderLeft>
                <HeaderRight>
                  <Value>
                    {Number(intent?.fees?.solver)?.toFixed(6) || "0"}{" "}
                    {intent?.token?.symbol}
                  </Value>
                  {/* {rates?.[intent?.token?.symbol] && (
                    <USDValue>
                      ~
                      {(
                        Number(intent?.sourcesTotal) /
                        Number(rates[intent?.token?.symbol])
                      ).toFixed(2)}{" "}
                      USD
                    </USDValue>
                  )} */}
                </HeaderRight>
              </FeeRow>
              <FeeRow>
                <HeaderLeft>
                  <Label>Protocol Fees:</Label>
                  <AppTooltip message="Total Fees">
                    <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
                  </AppTooltip>
                </HeaderLeft>
                <HeaderRight>
                  <Value>
                    {Number(intent?.fees?.protocol)?.toFixed(6) || "0"}{" "}
                    {intent?.token?.symbol}
                  </Value>
                  {/* {rates?.[intent?.token?.symbol] && (
                    <USDValue>
                      ~
                      {(
                        Number(intent?.sourcesTotal) /
                        Number(rates[intent?.token?.symbol])
                      ).toFixed(2)}{" "}
                      USD
                    </USDValue>
                  )} */}
                </HeaderRight>
              </FeeRow>
              <FeeRow>
                <HeaderLeft>
                  <Label>Gas Supplied:</Label>
                  <AppTooltip message="Total Fees">
                    <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
                  </AppTooltip>
                </HeaderLeft>
                <HeaderRight>
                  <Value>
                    {" "}
                    {intent?.fees.gasSupplied + " " + intent?.token?.symbol}
                  </Value>
                  {/* {rates?.[intent?.token?.symbol] && (
                    <USDValue>
                      ~
                      {(
                        Number(intent?.sourcesTotal) /
                        Number(rates[intent?.token?.symbol])
                      ).toFixed(2)}{" "}
                      USD
                    </USDValue>
                  )} */}
                </HeaderRight>
              </FeeRow>
            </FeeDetails>
          </AccordionContent>
        </AccordionWrapper>
      </Accordion.Root>

      <Header>
        <HeaderLeft>
          <TooltipMessage>Total</TooltipMessage>
          <AppTooltip message="Total Fees">
            <InfoImg src={InfoIcon} alt="Info" height={18} width={18} />
          </AppTooltip>
        </HeaderLeft>
        <HeaderRight>
          <TotalFeesValue>
            {Number(intent?.sourcesTotal)?.toFixed(6) || "0"}{" "}
            {intent?.token?.symbol}
          </TotalFeesValue>

          {rates?.[intent?.token?.symbol] && (
            <TotalAtDestinationValue>
              ~
              {(
                Number(intent?.sourcesTotal) /
                Number(rates[intent?.token?.symbol])
              ).toFixed(2)}{" "}
              USD
            </TotalAtDestinationValue>
          )}
        </HeaderRight>
      </Header>

      <ButtonWrap>
        <Button onClick={() => deny()} variant="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => allow()}
          disabled={intentRefreshing}
          variant="primary"
        >
          {intentRefreshing ? "Refreshing" : "Confirm"}
        </Button>
      </ButtonWrap>
    </Wrapper>
  );
};

export default FeesBreakdown;
