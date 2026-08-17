#import "ENRMTextRenderer.h"
#import "AccessibilityInfo.h"
#import "AttributedRenderer.h"
#import "MarkdownASTNode.h"
#import "ParagraphStyleUtils.h"
#import "RenderContext.h"
#import "StyleConfig.h"

@implementation ENRMRenderResult
@end

static ENRMRenderResult *ENRMRenderASTNodesCore(NSArray<MarkdownASTNode *> *nodes, StyleConfig *config,
                                                BOOL allowTrailingMargin, BOOL allowFontScaling,
                                                CGFloat maxFontSizeMultiplier, NSLineBreakStrategy lineBreakStrategy,
                                                BOOL asBlockquoteContent)
{
  MarkdownASTNode *root = [[MarkdownASTNode alloc] initWithType:MarkdownNodeTypeDocument];
  for (MarkdownASTNode *node in nodes) {
    [root addChild:node];
  }

  AttributedRenderer *renderer = [[AttributedRenderer alloc] initWithConfig:config];
  [renderer setAllowTrailingMargin:allowTrailingMargin];

  RenderContext *context = [RenderContext new];
  context.allowFontScaling = allowFontScaling;
  context.maxFontSizeMultiplier = maxFontSizeMultiplier;

  NSMutableAttributedString *attributedText = [renderer renderRoot:root
                                                           context:context
                                               asBlockquoteContent:asBlockquoteContent];

  // Paragraphs apply the paragraph line height regardless of block type; a quote's own line
  // height is stamped over the whole run here, matching Renderer.renderBlockquoteContent on Android.
  if (asBlockquoteContent && attributedText.length > 0) {
    applyLineHeight(attributedText, NSMakeRange(0, attributedText.length), [config blockquoteLineHeight]);
  }

  [context applyLinkAttributesToString:attributedText];
  ENRMApplyLineBreakStrategyToParagraphStyles(attributedText, lineBreakStrategy);

  ENRMRenderResult *result = [[ENRMRenderResult alloc] init];
  result.attributedText = attributedText;
  result.context = context;
  result.accessibilityInfo = [AccessibilityInfo infoFromContext:context];
  result.lastElementMarginBottom = [renderer getLastElementMarginBottom];
  return result;
}

ENRMRenderResult *ENRMRenderASTNodes(NSArray<MarkdownASTNode *> *nodes, StyleConfig *config, BOOL allowTrailingMargin,
                                     BOOL allowFontScaling, CGFloat maxFontSizeMultiplier,
                                     NSLineBreakStrategy lineBreakStrategy)
{
  return ENRMRenderASTNodesCore(nodes, config, allowTrailingMargin, allowFontScaling, maxFontSizeMultiplier,
                                lineBreakStrategy, /*asBlockquoteContent*/ NO);
}

ENRMRenderResult *ENRMRenderBlockquoteContentNodes(NSArray<MarkdownASTNode *> *nodes, StyleConfig *config,
                                                   BOOL allowFontScaling, CGFloat maxFontSizeMultiplier,
                                                   NSLineBreakStrategy lineBreakStrategy)
{
  return ENRMRenderASTNodesCore(nodes, config, /*allowTrailingMargin*/ NO, allowFontScaling, maxFontSizeMultiplier,
                                lineBreakStrategy, /*asBlockquoteContent*/ YES);
}
