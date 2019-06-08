const Heartbeat = '0';
const TestRequest = '1';
const ResendRequest = '2';
const Reject = '3';
const SequenceReset = '4';
const Logout = '5';
const IOI = '6';
const Advertisement = '7';
const ExecutionReport = '8';
const OrderCancelReject = '9';
const Logon = 'A';
const DerivativeSecurityList = 'AA';
const NewOrderMultileg = 'AB';
const MultilegOrderCancelReplace = 'AC';
const TradeCaptureReportRequest = 'AD';
const TradeCaptureReport = 'AE';
const OrderMassStatusRequest = 'AF';
const QuoteRequestReject = 'AG';
const RFQRequest = 'AH';
const QuoteStatusReport = 'AI';
const QuoteResponse = 'AJ';
const Confirmation = 'AK';
const PositionMaintenanceRequest = 'AL';
const PositionMaintenanceReport = 'AM';
const RequestForPositions = 'AN';
const RequestForPositionsAck = 'AO';
const PositionReport = 'AP';
const TradeCaptureReportRequestAck = 'AQ';
const TradeCaptureReportAck = 'AR';
const AllocationReport = 'AS';
const AllocationReportAck = 'AT';
const ConfirmationAck = 'AU';
const SettlementInstructionRequest = 'AV';
const AssignmentReport = 'AW';
const CollateralRequest = 'AX';
const CollateralAssignment = 'AY';
const CollateralResponse = 'AZ';
const News = 'B';
const CollateralReport = 'BA';
const CollateralInquiry = 'BB';
const NetworkCounterpartySystemStatusRequest = 'BC';
const NetworkCounterpartySystemStatusResponse = 'BD';
const UserRequest = 'BE';
const UserResponse = 'BF';
const CollateralInquiryAck = 'BG';
const ConfirmationRequest = 'BH';
const TradingSessionListRequest = 'BI';
const TradingSessionList = 'BJ';
const SecurityListUpdateReport = 'BK';
const AdjustedPositionReport = 'BL';
const AllocationInstructionAlert = 'BM';
const ExecutionAcknowledgement = 'BN';
const ContraryIntentionReport = 'BO';
const SecurityDefinitionUpdateReport = 'BP';
const SettlementObligationReport = 'BQ';
const DerivativeSecurityListUpdateReport = 'BR';
const TradingSessionListUpdateReport = 'BS';
const MarketDefinitionRequest = 'BT';
const MarketDefinition = 'BU';
const MarketDefinitionUpdateReport = 'BV';
const ApplicationMessageRequest = 'BW';
const ApplicationMessageRequestAck = 'BX';
const ApplicationMessageReport = 'BY';
const OrderMassActionReport = 'BZ';
const Email = 'C';
const OrderMassActionRequest = 'CA';
const UserNotification = 'CB';
const StreamAssignmentRequest = 'CC';
const StreamAssignmentReport = 'CD';
const StreamAssignmentReportACK = 'CE';
const NewOrderSingle = 'D';
const NewOrderList = 'E';
const OrderCancelRequest = 'F';
const OrderCancelReplaceRequest = 'G';
const OrderStatusRequest = 'H';
const AllocationInstruction = 'J';
const ListCancelRequest = 'K';
const ListExecute = 'L';
const ListStatusRequest = 'M';
const ListStatus = 'N';
const AllocationInstructionAck = 'P';
const DontKnowTrade = 'Q';
const QuoteRequest = 'R';
const Quote = 'S';
const SettlementInstructions = 'T';
const MarketDataRequest = 'V';
const MarketDataSnapshotFullRefresh = 'W';
const MarketDataIncrementalRefresh = 'X';
const MarketDataRequestReject = 'Y';
const QuoteCancel = 'Z';
const QuoteStatusRequest = 'a';
const MassQuoteAcknowledgement = 'b';
const SecurityDefinitionRequest = 'c';
const SecurityDefinition = 'd';
const SecurityStatusRequest = 'e';
const SecurityStatus = 'f';
const TradingSessionStatusRequest = 'g';
const TradingSessionStatus = 'h';
const MassQuote = 'i';
const BusinessMessageReject = 'j';
const BidRequest = 'k';
const BidResponse = 'l';
const ListStrikePrice = 'm';
const XMLnonFIX = 'n';
const RegistrationInstructions = 'o';
const RegistrationInstructionsResponse = 'p';
const OrderMassCancelRequest = 'q';
const OrderMassCancelReport = 'r';
const NewOrderCross = 's';
const CrossOrderCancelReplaceRequest = 't';
const CrossOrderCancelRequest = 'u';
const SecurityTypeRequest = 'v';
const SecurityTypes = 'w';
const SecurityListRequest = 'x';
const SecurityList = 'y';
const DerivativeSecurityListRequest = 'z';

module.exports = {
  Heartbeat,
  TestRequest,
  ResendRequest,
  Reject,
  SequenceReset,
  Logout,
  IOI,
  Advertisement,
  ExecutionReport,
  OrderCancelReject,
  Logon,
  DerivativeSecurityList,
  NewOrderMultileg,
  MultilegOrderCancelReplace,
  TradeCaptureReportRequest,
  TradeCaptureReport,
  OrderMassStatusRequest,
  QuoteRequestReject,
  RFQRequest,
  QuoteStatusReport,
  QuoteResponse,
  Confirmation,
  PositionMaintenanceRequest,
  PositionMaintenanceReport,
  RequestForPositions,
  RequestForPositionsAck,
  PositionReport,
  TradeCaptureReportRequestAck,
  TradeCaptureReportAck,
  AllocationReport,
  AllocationReportAck,
  ConfirmationAck,
  SettlementInstructionRequest,
  AssignmentReport,
  CollateralRequest,
  CollateralAssignment,
  CollateralResponse,
  News,
  CollateralReport,
  CollateralInquiry,
  NetworkCounterpartySystemStatusRequest,
  NetworkCounterpartySystemStatusResponse,
  UserRequest,
  UserResponse,
  CollateralInquiryAck,
  ConfirmationRequest,
  TradingSessionListRequest,
  TradingSessionList,
  SecurityListUpdateReport,
  AdjustedPositionReport,
  AllocationInstructionAlert,
  ExecutionAcknowledgement,
  ContraryIntentionReport,
  SecurityDefinitionUpdateReport,
  SettlementObligationReport,
  DerivativeSecurityListUpdateReport,
  TradingSessionListUpdateReport,
  MarketDefinitionRequest,
  MarketDefinition,
  MarketDefinitionUpdateReport,
  ApplicationMessageRequest,
  ApplicationMessageRequestAck,
  ApplicationMessageReport,
  OrderMassActionReport,
  Email,
  OrderMassActionRequest,
  UserNotification,
  StreamAssignmentRequest,
  StreamAssignmentReport,
  StreamAssignmentReportACK,
  NewOrderSingle,
  NewOrderList,
  OrderCancelRequest,
  OrderCancelReplaceRequest,
  OrderStatusRequest,
  AllocationInstruction,
  ListCancelRequest,
  ListExecute,
  ListStatusRequest,
  ListStatus,
  AllocationInstructionAck,
  DontKnowTrade,
  QuoteRequest,
  Quote,
  SettlementInstructions,
  MarketDataRequest,
  MarketDataSnapshotFullRefresh,
  MarketDataIncrementalRefresh,
  MarketDataRequestReject,
  QuoteCancel,
  QuoteStatusRequest,
  MassQuoteAcknowledgement,
  SecurityDefinitionRequest,
  SecurityDefinition,
  SecurityStatusRequest,
  SecurityStatus,
  TradingSessionStatusRequest,
  TradingSessionStatus,
  MassQuote,
  BusinessMessageReject,
  BidRequest,
  BidResponse,
  ListStrikePrice,
  XMLnonFIX,
  RegistrationInstructions,
  RegistrationInstructionsResponse,
  OrderMassCancelRequest,
  OrderMassCancelReport,
  NewOrderCross,
  CrossOrderCancelReplaceRequest,
  CrossOrderCancelRequest,
  SecurityTypeRequest,
  SecurityTypes,
  SecurityListRequest,
  SecurityList,
  DerivativeSecurityListRequest
}